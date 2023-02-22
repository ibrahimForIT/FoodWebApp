from rest_framework import viewsets, generics, mixins, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import *
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .permissions import *
from users.models import Profile
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.parsers import FileUploadParser, MultiPartParser
import xlwt
from rest_framework.pagination import PageNumberPagination

class RestaurantViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser]
    serializer_class = RestaurantSerializer
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Restaurant.objects.all()
    pagination_class = None

class VerifiedRestaurants(mixins.ListModelMixin, viewsets.GenericViewSet):
    pagination_class = None
    serializer_class = RestaurantSerializer
    queryset = Restaurant.objects.filter(verified=True)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter,)
    search_fields = ('name',)

class FoodViewSet(mixins.ListModelMixin,
                  mixins.RetrieveModelMixin,
                  mixins.UpdateModelMixin,
                  mixins.CreateModelMixin,
                  viewsets.GenericViewSet):
    pagination_class = None
    parser_classes = [MultiPartParser]
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FoodSerializer
    queryset = Food.objects.filter(hide=False)
    filter_backends = (filters.SearchFilter, filters.OrderingFilter,)
    search_fields = ('name',)
    pagination_class = None

class RatingVeiwSet(viewsets.ModelViewSet):
    pagination_class = None
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = RestaurantRatingSerializer
    queryset = RestaurantRating.objects.all()

class OrderVeiwSet(viewsets.ModelViewSet):
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = OrderSerializer
    queryset = Order.objects.all()
    pagination_class = None

class FoodForRestaurant(APIView):
    def post(self, request, *args, **kwargs):###
        rest = request.data.get("Content").get('restaurant', False)

        check = Restaurant.objects.filter(id=rest)

        if not check:
            raise serializers.ValidationError("No such Restaurant")

        food = Food.objects.filter(restaurant=rest, hide=False)

        if food:
            serializer = FoodSerializer_wiht_quant(food, many=True)
            return Response(serializer.data)

        return Response({
            'status': False,
            'detail': "this restaurant has no food"
        })

class SortRestaurant(generics.ListAPIView):
    pagination_class = None
    serializer_class = RestaurantSerializer
    def get_queryset(self):
        sorted_restaurants = Restaurant.objects.filter(verified=True).order_by('-avg_of_rating')
        return sorted_restaurants

class AvailableRestaurant(generics.ListAPIView):
    pagination_class = None
    serializer_class = RestaurantSerializer
    def get_queryset(self):
        current_hour = datetime.datetime.now().time().hour+1
        ret = Restaurant.objects.filter(from_hour__lte=current_hour, to_hour__gt=current_hour, verified=True)
        return ret

class FoodRatingViewSet(viewsets.ModelViewSet):
    pagination_class = None
    permission_classes = [IsOwnerOrReadOnly]
    serializer_class = FoodRatingSerializer
    queryset = FoodRating.objects.all()

class MyRestaurants(generics.ListAPIView):
    serializer_class = RestaurantSerializer
    pagination_class = None

    def get_queryset(self):
        user = self.request.user

        rec = Restaurant.objects.filter(owner=user)
        return rec


class MyStatistics(APIView):

    def post(self, request, *args, **kwargs):
        user = request.user
        rest = request.data.get("Content").get('restaurant', False)
        mon = request.data.get("Content").get('month', False)
        yer = request.data.get("Content").get('year', False)

        check = Restaurant.objects.filter(id=rest)

        if not check:
            raise serializers.ValidationError("No such Restaurant")
        check = check.first()
        if check.owner != user:
            raise serializers.ValidationError("Permission Denied")

        stat = Statistics.objects.filter(restaurant=rest, created_date__month=mon, created_date__year=yer)

        if not stat:
            return Response({
                'status': False,
                'detail': 'this restaurant hasn\'t added food yet'
            })

        serializer = StatisticsSerializer(stat, many=True)
        return Response({
            'status': True,
            'detail': serializer.data
        })

class OrdersForRestaurant(APIView):

    def post(self, request, *args, **kwargs):
        rest = request.data.get("Content").get('restaurant', False)
        status = request.data.get("Content").get('status', False)
        if not rest or not status:
            return Response({
                'status': False,
                'detail': 'Send an id and a status'
            })
        owner = Restaurant.objects.filter(id=rest).first().owner
        if owner != self.request.user:
            raise ValidationError("Permission Denied")
        if status == 'in_delivery':
            ret = Order.objects.filter(restaurant__id=rest, in_delivery=True)
        elif status == 'in_process':
            ret = Order.objects.filter(restaurant__id=rest, in_process=True, in_delivery=False)
        elif status == 'new':
            ret = Order.objects.filter(restaurant__id=rest, in_process=False, in_delivery=False)
        return Response({
            'orders': OrderSerializer(ret, many=True).data
        })

class OrdersForCustomer(APIView):

    def post(self, request, *args, **kwargs):
        customer = request.data.get("Content").get("customer", False)
        customer_profile = Profile.objects.filter(id=customer).first()
        if customer_profile != request.user:
            raise ValidationError("Permission Denied")

        if not customer:
            return Response({
                "status": False,
                "detail": "send a customer's id"
            })

        ret = Order.objects.filter(customer=customer)
        return Response({
            'status': True,
            'orders': OrderSerializer(ret, many=True).data
        })


@api_view(['GET'])
def StatisticsToXls(request, rest, month, year):
    response = HttpResponse(content_type='application/ms-excel')
    response['Content-Disposition'] = 'attachement; filename=report.xls'

    user = request.user

    owner = Restaurant.objects.filter(id=rest).first().owner

    if user != owner:
        raise ValidationError("Permission Denied")

    wb = xlwt.Workbook(encoding='utf-8')
    ws = wb.add_sheet('Statistics')

    row_num = 0

    font_style = xlwt.XFStyle()
    font_style.font.bold = True

    columns = ['food', 'amount', 'price', 'total price', 'number of ratings', 'average rating']

    for col_num in range(len(columns)):
        ws.write(row_num, col_num*2, columns[col_num], font_style)

    font_style = xlwt.XFStyle()

    if not rest:
        raise ValidationError("No restaurant with such id")

    rows = Statistics.objects.filter(restaurant=rest, created_date__month=month, created_date__year=year).values_list('food', 'amount', 'price', 'total_price', 'cnt_rating', 'avg_rating')
    for row in rows:
        row_num += 1
        for col_num in range(len(row)):
            if col_num == 0:
                name = Food.objects.filter(id=row[0]).first().name
                tmp = list(row)
                tmp[0] = name
                row = tmp
            ws.write(row_num, col_num*2, row[col_num], font_style)

    wb.save(response)
    return response


class RatingsForRestaurant(APIView):

    def post(self, request, *args, **kwargs):
        rest = request.data.get("Content").get("restaurant", False)
        if not rest:
            raise ValidationError("No restaurant with such id")

        ret = RestaurantRating.objects.filter(restaurant=rest)

        return Response({"ratings": RestaurantRatingSerializer(ret, many=True).data})

class RatingsForFood(APIView):

    def post(self, request, *args, **kwargs):
        food = request.data.get("Content").get("food", False)

        if not food:
            raise ValidationError("No food with such id")

        ret = FoodRating.objects.filter(food=food)

        return Response({"ratings": FoodRatingSerializer(ret, many=True).data})