from allauth.account.adapter import DefaultAccountAdapter
from django.conf import settings


class CustomAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        user.phone_no = data.get('phone_no')
        user.first_name = data.get('first_name')
        user.last_name = data.get('last_name')
        user.email = data.get('email')
        user.save()
        return user

    def send_mail(self, template_prefix, email, context):
        context['activate_url'] = settings.ACCOUNT_EMAIL_CONFIRMATION_URL + context['key']
        msg = self.render_mail(template_prefix, email, context)
        msg.send()