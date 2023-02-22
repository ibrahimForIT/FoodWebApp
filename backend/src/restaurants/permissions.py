from rest_framework import permissions
from .models import Restaurant, Food, RestaurantRating, Order, FoodRating

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        # print("req.user=",request.user,"\towner=",obj.owner)
        if type(obj) is Restaurant:
            return obj.owner == request.user
        elif type(obj) is Food:
            owner = Restaurant.objects.only('owner').get(id=obj.restaurant.id).owner
            return owner == request.user
        elif type(obj) is RestaurantRating:
            return obj.profile == request.user
        elif type(obj) is Order:
            return obj.customer == request.user or obj.restaurant.owner == request.user
        elif type(obj) is FoodRating:
            return obj.profile == request.user