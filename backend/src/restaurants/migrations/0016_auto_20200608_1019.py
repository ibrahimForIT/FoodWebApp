# Generated by Django 3.0.5 on 2020-06-08 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('restaurants', '0015_auto_20200529_1405'),
    ]

    operations = [
        migrations.RenameField(
            model_name='restaurant',
            old_name='img',
            new_name='logo',
        ),
        migrations.AddField(
            model_name='restaurant',
            name='cover',
            field=models.ImageField(default='default.jpg', upload_to='cover_pics'),
        ),
    ]
