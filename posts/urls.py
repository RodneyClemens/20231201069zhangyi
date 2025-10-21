from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("post/<int:pk>/", views.post_detail, name="post-detail"),
    path("post/new/", views.post_create, name="post-create"),
    path("post/<int:pk>/update/", views.post_update, name="post-update"),
    path("post/<int:pk>/delete/", views.post_delete, name="post-delete"),
    path("user/<str:username>/", views.user_posts, name="user-posts"),
    path("category/<str:category>/", views.category_posts, name="category-posts"),
    path("api/posts/", views.api_posts, name="api-posts"),
]