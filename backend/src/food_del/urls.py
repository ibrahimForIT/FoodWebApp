from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from django.conf import settings
from .views import null_view, current_user_id, UserByKey
from allauth.account.views import confirm_email #"""as allauthemailconfirmation"""
import allauth
from rest_auth.registration.views import VerifyEmailView, RegisterView, LoginView

urlpatterns = [
    path('api/current-user/', current_user_id),
    path('api/id-by-key/', UserByKey.as_view()),
    path('', null_view, name='account_email'),
    path('', include('django.contrib.auth.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/login/', LoginView.as_view(), name='account_login'),
    path('rest-auth/logout/', LoginView.as_view(), name='account_logout'),
    # re_path(r'^rest-auth/registration/account-confirm-email/(?P<key>[-:\w]+)/$', allauthemailconfirmation, name="account_confirm_email"),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),    
    path('rest-auth/registration/', RegisterView.as_view(), name='account_signup'),
    # re_path(r'^account-confirm-email/', VerifyEmailView.as_view(),
    #      name='account_email_verification_sent'),
    re_path(r'^verify-email/(?P<key>[-:\w]+)/$', confirm_email,
         name='account_confirm_email'),
    path('api/', include('restaurants.urls')),
    path('api/', include('users.urls')),
    path('api/', include('posts.urls')),
    # path('api-auth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
