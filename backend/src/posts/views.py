from django.shortcuts import render
from rest_framework import viewsets, mixins, generics, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Post, Likes
from .serializers import PostsSerializer, LikesSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FileUploadParser
import datetime

class PostsViewset(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser]
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Post.objects.all().order_by('-id')
    serializer_class = PostsSerializer
    pagination_class = PageNumberPagination

class LieksViewset(mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   mixins.CreateModelMixin,
                   mixins.DestroyModelMixin,
                   viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = LikesSerializer
    queryset = Likes.objects.all()

class TopPosts(generics.ListAPIView):
    serializer_class = PostsSerializer

    def get_queryset(self):
        today = datetime.datetime.today()
        rec = Post.objects.filter(date_posted__day=today.day).order_by('-like_cnt')
        return rec

class PostsForRestaurant(APIView):


    def post(self, request, *args, **kwargs):
        rest = request.data.get("Content").get("restaurant", False)

        if not rest:
            raise serializers.ValidationError("No restaurant with such id")

        ret = Post.objects.filter(author=rest).order_by('-id')

        return Response({"posts": PostsSerializer(ret, many=True).data})

class isLiked(APIView):

    def post(self, request, *args, **kwargs):
        post_id = request.data.get("Content").get("post", False)

        if post_id:
            user = request.user
            rec = Likes.objects.filter(post__id=post_id, person=user).first()
            if rec:
                return Response({1})
            else:
                return Response({0})
        return Response({0})

class Unlike(APIView):

    def post(self, request, *args, **kwargs):
        post_id = request.data.get("post", False)

        if post_id:
            Likes.objects.filter(post__id=post_id, person=request.user).first().delete()
            return Response("Done")
        else:
            return Response("Wrong Parameters")