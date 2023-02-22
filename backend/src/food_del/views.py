from rest_framework import status, generics, serializers
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from users.models import Profile
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

@api_view()
def null_view(request):
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def current_user_id(request):
    user = request.user
    return Response({
        'id': user.id,
        "token": request.auth
    })

class UserByKey(APIView):

    def post(self, request, *args, **kwargs):
        key = request.data.get("Content").get('key', False)
        print("#here",request.user)

        if not key:
            raise serializers.ValidationError("Wrong parameters")

        ret = Token.objects.filter(key=key).first()

        if not ret:
            raise serializers.ValidationError("No such key")

        return Response({"id": ret.user.id})