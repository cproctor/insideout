from django.db import models
from random import randint

feelings = [
    'anger_inside', 
    'anger_outside', 
    'joy_inside', 
    'joy_outside', 
    'fear_inside', 
    'fear_outside',
    'disgust_inside',
    'disgust_outside',
    'sadness_inside',
    'sadness_outside'
]


class APIModel(models.Model):
    """
    An abstract class which allows us to implement some useful functionality
    once instead of repeating. 
    """
    name = models.CharField(max_length=100)
    secret = models.CharField(unique=True, max_length=100)

    @classmethod
    def generate_secret(cls):
        "Creates a secret number to use as a pid, etc. Checks for uniqueness."
        while True:
            secret = "".join(str(randint(1, 9)) for _ in range(6))
            if not cls.objects.filter(secret=secret).exists():
                print(secret)
                return secret

    def to_json(self, private=False):
        "Returns the object's properties ready for dumping to json"
        if private:
            return {attr : getattr(self, attr) for attr in self.gettable_attributes}
        else:
            return {attr : getattr(self, attr) for attr in self.gettable_attributes if attr != 'secret'}

class Classroom(APIModel):
    "Represents a classroom of people. Has attributes which average the attributes of the people."
    gettable_attributes = feelings + ['name', 'secret', 'people_json']
    settable_attributes = ['name']
    pet_name = models.CharField(max_length=100)

    def average(self, attribute):
        if self.people.exists():
            return sum(getattr(person, attribute) for person in self.people.all())/self.people.count()
        else:
            return 0
    @property
    def anger_inside(self):
        return self.average('anger_inside')
    @property
    def anger_outside(self):
        return self.average('anger_outside')
    @property
    def joy_inside(self):
        return self.average('joy_inside')
    @property
    def joy_outside(self):
        return self.average('joy_outside')
    @property
    def fear_inside(self):
        return self.average('fear_inside')
    @property
    def fear_outside(self):
        return self.average('fear_outside')
    @property
    def disgust_inside(self):
        return self.average('disgust_inside')
    @property
    def disgust_outside(self):
        return self.average('disgust_outside')
    @property
    def sadness_inside(self):
        return self.average('sadness_inside')
    @property
    def sadness_outside(self):
        return self.average('sadness_outside')

    @property
    def people_json(self):
        return [p.to_json() for p in self.people.all()]

class Person(APIModel):
    "Represents an individual person"
    gettable_attributes = feelings + ['name', 'pet_name', 'secret']
    settable_attributes = feelings

    pet_name = models.CharField(max_length=100)
    group = models.ForeignKey(Classroom, blank=True, null=True, related_name='people', 
            on_delete='cascade')
    anger_inside = models.IntegerField(default=0)
    anger_outside = models.IntegerField(default=0)
    joy_inside = models.IntegerField(default=0)
    joy_outside = models.IntegerField(default=0)
    fear_inside = models.IntegerField(default=0)
    fear_outside = models.IntegerField(default=0)
    disgust_inside = models.IntegerField(default=0)
    disgust_outside = models.IntegerField(default=0)
    sadness_inside = models.IntegerField(default=0)
    sadness_outside = models.IntegerField(default=0)

    
    
    
