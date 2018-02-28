"""insideout URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from insideout.views import crossdomain, homepage
from feelings import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', homepage, name='home'),
    path('crossdomain.xml', crossdomain, name='crossdomain'),
    path('people/new/<name>', views.CreatePersonView.as_view(), name='new_person'),
    path('people/<secret>', views.ShowPersonView.as_view(), name='show_person'),
    path('people/<secret>/set/<attribute>/<int:value>', views.UpdatePersonView.as_view(), name='update_person'),
    path('classrooms/new/<name>', views.CreateClassroomView.as_view(), name='new_classroom'),
    path('classrooms/<secret>', views.ShowClassroomView.as_view(), name='show_classroom'),
    path('people/<secret>/classroom/<parent_secret>/join', views.AddPersonToClassroomView.as_view(), name='add_player_to_classroom')
]
