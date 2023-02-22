from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import validate_email


class Profile(AbstractUser):
    phone_no = models.CharField(max_length=10, unique=True, blank=False, help_text='Contact phone number')
    first_name = models.CharField(max_length=100, blank=False)
    last_name = models.CharField(max_length=100, blank=False)
    email = models.EmailField(max_length=100, validators=[validate_email], blank=False, unique=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}\'s Profile'

class PhoneOTP(models.Model):
    phone = models.CharField(max_length=10, unique=True, blank=False)
    OTP = models.IntegerField(blank=False)
    sent_cnt = models.IntegerField(default=1)
    validated = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.phone}\'s OTP'