from django.db import models
from PIL import Image
from restaurants.models import Restaurant
from users.models import Profile
from django.db.models.signals import post_save, post_delete, pre_save

class Post(models.Model):
    author = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    date_posted = models.DateTimeField(auto_now_add=True, editable=False)
    img = models.ImageField(upload_to="posts_pics", blank=True)
    like_cnt = models.IntegerField(default=0, editable=False)

class Likes(models.Model):
    post = models.ForeignKey(Post, blank=False, on_delete=models.CASCADE)
    person = models.ForeignKey(Profile, blank=False, editable=False, on_delete=models.CASCADE)


def pre_save_like(sender, instance, *args, **kwargs):
    rec = Likes.objects.filter(post=instance.post.id, person=instance.person.id)
    if rec:
        rec.delete()

pre_save.connect(pre_save_like, sender=Likes)

def post_save_delete_like(sender, instance, *args, **kwargs):
    cnt = Likes.objects.filter(post=instance.post.id).count()
    Post.objects.filter(id=instance.post.id).update(like_cnt=cnt)

post_delete.connect(post_save_delete_like, sender=Likes)
post_save.connect(post_save_delete_like, sender=Likes)