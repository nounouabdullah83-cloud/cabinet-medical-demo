from django.db import models

# Create your models here.
class Service(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    price = models.FloatField()
    image = models.ImageField(upload_to='', null=True, blank=True)
    created_at_date = models.DateField(auto_now_add=True)
    created_at_time = models.TimeField(auto_now_add=True)

    def __str__(self):
        return self.title