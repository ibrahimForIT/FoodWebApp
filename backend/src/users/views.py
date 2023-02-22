from rest_framework import viewsets, mixins, generics
from .models import Profile, PhoneOTP
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_auth.views import LoginView
from .permissions import IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
import random

class ProflieCreateViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class ProfileURDView(mixins.ListModelMixin, mixins.UpdateModelMixin,
                     mixins.RetrieveModelMixin,
                     mixins.DestroyModelMixin, viewsets.GenericViewSet):
    permission_classes = [IsOwnerOrReadOnly]
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializerURD

class ValidatePhone(APIView):

    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        req_phone = request.data.get("Content").get('phone')
        if req_phone:
            phone_str = str(req_phone)
            user = Profile.objects.filter(phone_no__iexact=phone_str)
            user = user.first()
            if user:
                return Response({
                    'status': False,
                    'detail': 'phone number already exists'
                })
            else:
                key = send_otp(phone_str)
                if key:
                    old = PhoneOTP.objects.filter(phone__iexact=phone_str)
                    if old.exists():
                        old = old.first()
                        cnt = old.sent_cnt
                        if old.sent_cnt > 5:
                            return Response({
                                'status': False,
                                'detail': 'maximum number of verification codes is reached, please contact our support team'
                            })
                        old.sent_cnt = cnt+1
                        old.save()
                    else:
                        PhoneOTP.objects.create(phone=phone_str, OTP=key, )
                        return Response({
                            'status': True,
                            'detail': 'OTP is sent successfully'
                        })
                else:
                    return Response({
                        'status': False,
                        'detail': 'Error occurred, the message is not sent'
                    })

        else:
            return Response({
                'status': False,
                'detail': 'Phone number must be given'
            })

def send_otp(phone):
    if phone:
        key = random.randint(1000, 9999)

        """
            Here goes the actual key sending to the phone
        """

        return key
    else:
        return False

class ValidateOTP(APIView):

    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        phone = request.data.get("Content").get('phone', False)
        sent_otp = request.data.get("Content").get('otp', False)

        if phone and sent_otp:
            rec = PhoneOTP.objects.filter(phone__iexact=phone)

            if rec:
                rec = rec.first()
                otp = rec.OTP
                if str(otp) == str(sent_otp):
                    rec.validated = True
                    rec.save()
                    return Response({
                        'status': True,
                        'detail': 'codes matched, please proceed for registration'
                    })

                else:
                    return Response({
                        'status': False,
                        'detail': 'codes didn\'t match'
                    })
            else:
                return Response({
                    'status': False,
                    'detail': 'please send a verification code request first'
                })
        else:
            return Response({
                'status': False,
                'detail': 'pleases provide both phone and verification code'
            })