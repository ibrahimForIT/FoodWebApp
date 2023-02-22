from django.db import models
from django.db.models import Sum
from users.models import *
from django.db.models.signals import pre_save, post_save, post_delete, pre_delete
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator
from PIL import Image
import datetime

# hours can differ in respect to days
# try location using google maps !

class Restaurant(models.Model):
    owner = models.ForeignKey(Profile, editable=False, on_delete=models.CASCADE)
    name = models.TextField(max_length=30, unique=True)
    location = models.TextField(max_length=150)
    from_hour = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(24)])
    to_hour = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(24)])
    img = models.ImageField(default="default.jpg", upload_to="profile_pics") #which is logo
    cover = models.ImageField(default="default.jpg", upload_to="cover_pics")
    order_cnt = models.IntegerField(default=0, editable=False)
    no_of_ratings = models.IntegerField(default=0, editable=False)
    avg_of_rating = models.FloatField(default=0, editable=False)
    verified = models.BooleanField(default=False)
    order_id = models.IntegerField(default=0, editable=False)


    def __str__(self):
        return self.name+" Restaurant"

    def save(self, *args, **kwargs):
        super(Restaurant, self).save(*args, **kwargs)

        img = Image.open(self.img.path)

        if img.height > 600 or img.width > 900:
            output_size = (600, 900)
            img.thumbnail(output_size)
            img.save(self.img.path)

class Food(models.Model):
    price = models.IntegerField(blank=False)
    name = models.TextField(max_length=50, default="blah", blank=False)
    description = models.TextField(max_length=120, blank=False)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    no_of_ratings = models.IntegerField(default=0, editable=False)
    avg_of_rating = models.FloatField(default=0, editable=False)
    hide = models.BooleanField(default=False)
    img = models.ImageField(blank=False, upload_to="food_pics")

    def __str__(self):
        restaurant_name = Restaurant.objects.only('name').get(id=self.restaurant.id).name
        return self.name+" By " + restaurant_name

def pre_delete_food_restaurant(sender, instance, *args, **kwargs):
    instance.img.delete(False)
pre_delete.connect(pre_delete_food_restaurant, sender=Food)
pre_delete.connect(pre_delete_food_restaurant, sender=Restaurant)

def post_save_food(sender, instance, *args, **kwargs):
    Statistics.objects.create(restaurant=instance.restaurant, food=instance, price=instance.price, amount=0)
post_save.connect(post_save_food, sender=Food)

class RestaurantRating(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, editable=False, on_delete=models.CASCADE)
    review = models.TextField(max_length=100, blank=True)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

def pre_save_restaurant_raintg(sender, instance, *args, **kwargs):
    rec = RestaurantRating.objects.filter(restaurant=instance.restaurant, profile=instance.profile).delete()
pre_save.connect(pre_save_restaurant_raintg, sender=RestaurantRating)

def post_save_delete_restaurant_rating(sender, instance, *args, **kwargs):
    no_rating = RestaurantRating.objects.filter(restaurant=instance.restaurant).count()
    sum_stars = list(RestaurantRating.objects.filter(restaurant=instance.restaurant).aggregate(Sum('stars')).values())[0]
    if (no_rating):
        avg_rating = sum_stars / no_rating
    else:
        avg_rating = 0
    Restaurant.objects.filter(id=instance.restaurant.pk).update(no_of_ratings=no_rating, avg_of_rating=avg_rating)
post_save.connect(post_save_delete_restaurant_rating, sender=RestaurantRating)
post_delete.connect(post_save_delete_restaurant_rating, sender=RestaurantRating)

class Order(models.Model):
    customer = models.ForeignKey(Profile, editable=False, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    food_ids = models.TextField(max_length=300, blank=False)
    food_quantities = models.TextField(max_length=300, blank=False)
    notes = models.TextField(max_length=200, default="NONE")
    deliver_location = models.TextField(max_length=200, blank=False)
    order_time = models.DateTimeField(auto_now_add=True, editable=False)
    in_process = models.BooleanField(default=False)
    in_delivery = models.BooleanField(default=False)

    def total_value(self):
        sum = 0
        ids = self.food_ids.split()
        quan = self.food_quantities.split()
        for i in range(len(ids)):
            price = Food.objects.values_list('price').get(id=int(ids[i]))
            sum += price[0] * int(quan[i])
        return sum

def post_save_order(sender, instance, created, *args, **kwargs ):
        new_order_cnt = instance.restaurant.order_cnt + (-1 if instance.in_process and not instance.in_delivery else (1 if created else 0))
        new_order_id = instance.restaurant.order_id
        if created:
            new_order_id += 1
        Restaurant.objects.filter(id=instance.restaurant.pk).update(order_cnt=new_order_cnt, order_id=new_order_id)

post_save.connect(post_save_order,  sender=Order)

def post_delete_order(sender, instance, *args, **kwargs):
    new_order_cnt = Restaurant.objects.only('order_cnt').get(id=instance.restaurant.id).order_cnt
    new_order_cnt -= 1
    new_order_id = Restaurant.objects.only('order_id').get(id=instance.restaurant.id).order_id
    new_order_id -= 1
    Restaurant.objects.filter(id=instance.restaurant.pk).update(order_cnt=new_order_cnt, order_id=new_order_id)

post_delete.connect(post_delete_order, sender=Order)

class FoodRating(models.Model):
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, editable=False, on_delete=models.CASCADE)
    review = models.TextField(max_length=100, blank=True)
    stars = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

def pre_save_restaurant_foodrating(sender, instance, *args, **kwargs):
    rec = FoodRating.objects.filter(food=instance.food, profile=instance.profile).delete()
pre_save.connect(pre_save_restaurant_foodrating, sender=FoodRating)

def post_save_delete_food_rating(sender, instance, *args, **kwargs):
    no_ratings = FoodRating.objects.filter(food=instance.food).count()
    sum_stars = list(FoodRating.objects.filter(food=instance.food).aggregate(Sum('stars')).values())[0]
    if (no_ratings):
        avg_rating = sum_stars / no_ratings
    else:
        avg_rating = 0
    Statistics.objects.filter(food__id=instance.food.pk).update(avg_rating=avg_rating, cnt_rating=no_ratings)
    Food.objects.filter(id=instance.food.pk).update(no_of_ratings=no_ratings, avg_of_rating=avg_rating)

post_save.connect(post_save_delete_food_rating, sender=FoodRating)
post_delete.connect(post_save_delete_food_rating, sender=FoodRating)

class Statistics(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    amount = models.IntegerField(default=0)
    price = models.IntegerField(blank=False)
    total_price = models.IntegerField(default=0, editable=False)
    cnt_rating = models.IntegerField(default=0, editable=False)
    avg_rating = models.FloatField(default=0, editable=False)
    created_date = models.DateTimeField(auto_now_add=True, editable=False)