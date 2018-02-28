from django.shortcuts import render, redirect
from django.http import JsonResponse, Http404
from django.views.generic.base import View
from feelings.models import Person, Classroom
from django.db import IntegrityError

class JsonErrorResponse(JsonResponse):
    "Like a regular JsonResponse, but with an error status code"
    status_code = 404

# Define some generic views which work for people or classrooms

class ModelView(View):
    "A view which automatically looks up the associated model instance"
    def get(self, request, *args, **kwargs):
        try:
            self.instance = self.model.objects.get(secret=kwargs['secret'])
            return self.handle(*args, **kwargs)
        except self.model.DoesNotExist:
            return JsonErrorResponse({'error': 'invalid id'})

    def handle(self, *args, **kwargs):
        "Does the view's work. Override this in subclasses."
        return JsonResponse(self.instance.to_json(private=True))

class NestedModelView(ModelView):
    def get(self, request, *args, **kwargs):
        try:
            self.instance = self.model.objects.get(secret=kwargs['secret'])
            self.parent_instance = self.parent_model.objects.get(secret=kwargs['parent_secret'])
            return self.handle(*args, **kwargs)
        except self.model.DoesNotExist:
            return JsonErrorResponse({'error': 'invalid id'})
        except self.parent_model.DoesNotExist:
            return JsonErrorResponse({'error': 'invalid id'})

class CreateModelView(View):
    def get(self, request, *args, **kwargs):
        instance = self.model(secret=self.model.generate_secret(), **kwargs)
        instance.save()
        return redirect('show_' + self.model.__name__.lower(), instance.secret)

class UpdateModelView(ModelView):
    def handle(self, *args, **kwargs):
        if kwargs['attribute'] not in self.instance.settable_attributes:
            return JsonErrorResponse({'error': 'cannot update {}'.format(args['attribute'])})
        setattr(self.instance, kwargs['attribute'], kwargs['value'])
        self.instance.save()
        return redirect('show_' + self.model.__name__.lower(), self.instance.secret)
    
# Subclass the generic views
class ShowPersonView(ModelView):
    model = Person

class CreatePersonView(CreateModelView):
    model = Person

class UpdatePersonView(UpdateModelView):
    model = Person

class CreateClassroomView(CreateModelView):
    model = Classroom

class ShowClassroomView(ModelView):
    model = Classroom

class AddPersonToClassroomView(NestedModelView):
    model = Person
    parent_model = Classroom
    def handle(self, *args, **kwargs):
        self.parent_instance.people.add(self.instance)
        return redirect('show_' + self.parent_model.__name__.lower(), self.parent_instance.secret)


