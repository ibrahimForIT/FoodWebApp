from rest_framework import serializers
from .models import *
from rest_framework.serializers import ValidationError

class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = ('id', 'name', 'price', 'description', 'restaurant', 'no_of_ratings', 'avg_of_rating', 'img', 'hide')
    def validate(self, attrs):
        user = self.context['request'].user
        owner = Restaurant.objects.only('owner').get(id=attrs['restaurant'].id).owner
        if owner != user:
            raise ValidationError('Permission Denied')
        if not attrs['restaurant'].verified:
            raise ValidationError("pleases verify your restaurant first")
        return attrs

    def validate_price(self, new_price):
        if not self.instance:
            return new_price
        if new_price!=self.instance.price:
            now=datetime.datetime.now().hour
            print("now=",now,"from=",self.instance.restaurant.from_hour,"to=",self.instance.restaurant.to_hour)
            if now>=self.instance.restaurant.from_hour and now<=self.instance.restaurant.to_hour:
                raise ValidationError("Can't change price while restaurant is open")
        return new_price

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        # fields = '__all__'
        fields = ('id', 'owner', 'name', 'location', 'from_hour', 'to_hour', 'img', 'cover', 'no_of_ratings', 'avg_of_rating', 'order_cnt', 'order_id', 'verified')
    def validate(self, attrs):
        user = self.context['request'].user
        attrs['owner'] = user
        if attrs['from_hour'] > attrs['to_hour']:
            raise ValidationError("pleases check opening hours")
        rec = self.instance
        if (rec and attrs['verified'] != rec.verified) or (not rec and attrs['verified']):
            raise ValidationError('Permission Denied here')
        return attrs

class RestaurantRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestaurantRating
        fields = ('id', 'restaurant', 'profile', 'review', 'stars')
    def validate(self, attrs):
        user = self.context['request'].user
        # if user.is_anonymous:
        #     raise ValidationError("Please login first")
        attrs['profile'] = user
        if not attrs['restaurant'].verified:
            raise ValidationError("this restaurant is not verified yet")
        return attrs

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('id', 'customer', 'restaurant', 'food_ids', 'food_quantities', 'notes', 'deliver_location', 'order_time', 'total_value', 'in_process', 'in_delivery')
    def validate(self, attrs):
        user = self.context['request'].user
        # if user.is_anonymous:
        #     raise ValidationError("Please login first")
        if not self.instance:
            attrs['customer'] = user
        if not attrs['restaurant'].verified:
            raise ValidationError('this restaurant is not verified yet')
        owner = attrs['restaurant'].owner
        if user == owner and self.instance:
            # restaurant admin is moving order to next phase
            check = True
            for i in self.fields:
                if i == 'in_process':
                    break
                if not i in attrs or i == 'customer':
                    continue
                check = check and (getattr(self.instance, i) == attrs[i])
            if not check:
                raise ValidationError("Permission Denied")

            if attrs['in_delivery'] and not attrs['in_process']:
                raise ValidationError("Order must be in process first")

            if attrs['in_process'] and (not ('in_delivery' in attrs) or not attrs['in_delivery']):
                print("here in condition")
                # Order has just been moved to in_process queue and can't be edited any more so update statistics
                ids = attrs['food_ids'].split()
                quan = attrs['food_quantities'].split()
                for i in range(len(ids)):
                    price = Food.objects.values_list('price').get(id=int(ids[i]))
                    rec = Statistics.objects.filter(restaurant=self.instance.restaurant.id, food=int(ids[i]),
                                                    created_date__month=self.instance.order_time.month,
                                                    created_date__year=self.instance.order_time.year).first()
                    if not rec:
                        tmp_price = Food.objects.filter(id=int(ids[i])).first().price
                        rec = Statistics.objects.create(restaurant=self.instance.restaurant,
                                                        food=Food.objects.filter(id=int(ids[i])).first(), price=tmp_price,
                                                        amount=0)
                    rec.amount += int(quan[i])
                    rec.total_price += price[0] * int(quan[i])
                    rec.save()

        else:
            if self.instance and self.instance.in_process:
                raise ValidationError("Can\'t edit order now")

            if attrs['in_process'] or attrs['in_delivery']:
                raise ValidationError("Permission Denied")

        return attrs

class FoodRatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodRating
        fields = ('id', 'food', 'profile', 'review', 'stars')

    def validate(self, attrs):
        user = self.context['request'].user
        # if user.is_anonymous:
        #     raise ValidationError("Please login first")
        attrs['profile'] = user
        rest = Food.objects.filter(id=attrs['food'].id).first().restaurant
        # rest = Restaurant.objects.filter(id=rest).first()
        if (self.instance and (not self.instance.food.restaurant.verified)) or (not rest.verified):
            raise ValidationError('this restaurant is not verified yet')
        return attrs

class StatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistics
        fields = ('id', 'restaurant', 'food', 'amount', 'price', 'total_price', 'cnt_rating', 'avg_rating')

class FoodSerializer_wiht_quant(serializers.ModelSerializer):

    quant = serializers.SerializerMethodField()

    class Meta:
        model = Food
        fields = ('id', 'name', 'price', 'description', 'restaurant', 'no_of_ratings', 'avg_of_rating', 'img', 'hide', 'quant')

    def get_quant(self, obj):
        return 0