from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

app_name = 'users'

router = DefaultRouter()
# router.register(r'profile-register', ProflieCreateViewSet)
router.register(r'profile', ProfileURDView)
urlpatterns = [
    path('validate-phone/', ValidatePhone.as_view()),
    path('validate-otp/', ValidateOTP.as_view()),
    path('', include(router.urls))
]