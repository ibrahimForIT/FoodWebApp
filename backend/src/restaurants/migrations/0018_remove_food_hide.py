# Generated by Django 3.0.5 on 2020-07-26 16:05

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0017_auto_20200726_1756'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='food',
            name='hide',
        ),
    ]
