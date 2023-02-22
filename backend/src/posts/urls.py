from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

app_name = 'posts'

router = DefaultRouter()
router.register(r'posts', PostsViewset)
router.register(r'likes', LieksViewset)
urlpatterns = [
    path('is-liked/', isLiked.as_view()),
    path('top-posts/', TopPosts.as_view()),
    path('posts-for-restaurant/', PostsForRestaurant.as_view()),
    path('unlike/', Unlike.as_view()),
    path('', include(router.urls))
]