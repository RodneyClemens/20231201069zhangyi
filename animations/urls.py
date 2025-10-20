from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("types", views.animation_types, name="animation_types"),
    path("interactive", views.interactive_animations, name="interactive_animations")
]