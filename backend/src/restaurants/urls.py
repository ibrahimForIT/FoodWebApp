from rest_framework.routers import DefaultRouter
from .views import *
from django.urls import path, include

router = DefaultRouter()
router.register(r'restaurant/verified', VerifiedRestaurants)
router.register(r'restaurant', RestaurantViewSet)
router.register(r'food', FoodViewSet)
router.register(r'restaurant_rating', RatingVeiwSet)
router.register(r'order', OrderVeiwSet)
router.register(r'food_rating', FoodRatingViewSet)

urlpatterns = [
    path('xls/<int:rest>/<int:year>/<int:month>', StatisticsToXls),
    path('orders-for-restaurant/', OrdersForRestaurant.as_view()),
    path('orders-for-customer/', OrdersForCustomer.as_view()),
    # path('search/', Search.as_view()),
    path('ratings-for-restaurant/', RatingsForRestaurant.as_view()),
    path('ratings-for-food/', RatingsForFood.as_view()),
    path('food-for-restaurant/', FoodForRestaurant.as_view()),
    path('my-restaurants/', MyRestaurants.as_view()),
    path('restaurant/rating/', SortRestaurant.as_view()),
    path('restaurant/available/', AvailableRestaurant.as_view()),
    path('my-statistics/', MyStatistics.as_view()),
    path('', include(router.urls))
]