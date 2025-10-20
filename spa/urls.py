from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sections/<int:num>', views.section, name='section'),
    path('sections/<int:num>/', views.section, name='section_with_slash'),  # 支持带斜杠的URL
    # 添加对直接访问sectionX路径的支持，都指向index视图
    re_path(r'^section\d+$', views.index, name='section_direct'),
    path('game/', views.game, name='game'),
]