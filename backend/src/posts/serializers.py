from rest_framework import serializers
from .models import Post, Likes
from restaurants.models import Restaurant
import datetime

class PostsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'date_posted', 'author', 'img', 'like_cnt')

    def validate(self, attrs):
        user = self.context['request'].user
        restaurant = Restaurant.objects.filter(id=attrs['author'].id).first()
        if not restaurant.verified:
            raise serializers.ValidationError("please verify this restaurant first")
        if user != restaurant.owner:
            raise serializers.ValidationError("you must be the owner of the restaurant")
        return attrs

class LikesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Likes
        fields = ('id', 'post', 'person')

    def validate(self, attrs):
        person = self.context['request'].user
        attrs['person'] = person
        return attrs