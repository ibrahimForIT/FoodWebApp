from rest_framework import serializers
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email
from rest_auth.registration.serializers import RegisterSerializer
from rest_auth.serializers import LoginSerializer
from .models import Profile, PhoneOTP
from django.core.exceptions import ValidationError

class ProfileSerializer(RegisterSerializer):

    username = None

    phone_no = serializers.CharField(max_length=10, help_text='Contact phone number')
    first_name = serializers.CharField(max_length=100, )
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField(max_length=100)

    def get_cleaned_data(self):
        data_dict = super().get_cleaned_data()
        data_dict['phone_no'] = self.validated_data.get('phone_no', '')
        data_dict['first_name'] = self.validated_data.get('first_name', '')
        data_dict['last_name'] = self.validated_data.get('last_name', '')
        data_dict['email'] = self.validated_data.get('email', '')
        return data_dict

    def validate_phone_no(self, phone_no):
        sent_phone = phone_no
        phone_otp_rec = PhoneOTP.objects.filter(phone=sent_phone)
        if phone_otp_rec:
            phone_otp_rec = phone_otp_rec.first()
            if phone_otp_rec.validated:
                return phone_no
            else:
                raise serializers.ValidationError('Pleases verify your phone number first')
        else:
            raise serializers.ValidationError('Please request a verification code first')

class ProfileSerializerURD(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'email', 'phone_no', 'first_name', 'last_name')

    def validate_phone_no(self, new_phone):
        if new_phone!=self.instance.phone_no:
            raise ValidationError("Can't change phone number")
        return new_phone

class LoginCustomSerializer(LoginSerializer):
    email = None
    username = None
    id_field = serializers.CharField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        id_field = attrs['id_field']
        pass_word = attrs['password']

        user = None

        if '@' in id_field:
            user = Profile.objects.filter(email__iexact=id_field).first()
        elif id_field.isdigit():
            user = Profile.objects.filter(phone_no=id_field).first()

        if not user:
            raise serializers.ValidationError("User does not exist")

        if not user.check_password(pass_word):
            raise serializers.ValidationError('Invalid password')

        attrs['user']=user

        return attrs