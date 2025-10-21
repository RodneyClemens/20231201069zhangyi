from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

from .models import Post
from .forms import PostForm

# 博客首页 - 显示所有文章列表
def home(request):
    # 搜索功能
    search_query = request.GET.get('q', '')
    if search_query:
        posts = Post.objects.filter(
            Q(title__icontains=search_query) | 
            Q(content__icontains=search_query) |
            Q(author__username__icontains=search_query) |
            Q(tags__icontains=search_query)
        ).order_by('-date_posted')
    else:
        posts = Post.objects.all().order_by('-date_posted')
    
    # 分页功能
    paginator = Paginator(posts, 5)  # 每页显示5篇文章
    page = request.GET.get('page')
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)
    
    # 侧边栏数据
    categories = Post.objects.exclude(category__isnull=True).exclude(category='').values_list('category', flat=True).distinct()
    
    return render(request, "posts/home.html", {'posts': posts, 'page_obj': posts, 'search_query': search_query, 'categories': categories})

# 文章详情页
def post_detail(request, pk):
    post = get_object_or_404(Post, pk=pk)
    return render(request, "posts/post_detail.html", {'post': post})

# 创建新文章 (需要登录)
@login_required
def post_create(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            messages.success(request, '文章已成功创建！')
            return redirect('post-detail', pk=post.pk)
    else:
        form = PostForm()
    return render(request, "posts/post_form.html", {'form': form, 'title': '创建新文章'})

# 更新文章 (需要登录且是作者)
@login_required
def post_update(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.author != request.user:
        messages.error(request, '您没有权限编辑这篇文章！')
        return redirect('post-detail', pk=post.pk)
    
    if request.method == 'POST':
        form = PostForm(request.POST, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, '文章已成功更新！')
            return redirect('post-detail', pk=post.pk)
    else:
        form = PostForm(instance=post)
    return render(request, "posts/post_form.html", {'form': form, 'title': '编辑文章'})

# 删除文章 (需要登录且是作者)
@login_required
def post_delete(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if post.author != request.user:
        messages.error(request, '您没有权限删除这篇文章！')
        return redirect('post-detail', pk=post.pk)
    
    if request.method == 'POST':
        post.delete()
        messages.success(request, '文章已成功删除！')
        return redirect('home')
    return render(request, "posts/post_confirm_delete.html", {'post': post})

# 显示用户的所有文章
def user_posts(request, username):
    posts = Post.objects.filter(author__username=username).order_by('-date_posted')
    
    # 分页
    paginator = Paginator(posts, 5)
    page = request.GET.get('page')
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)
    
    return render(request, "posts/user_posts.html", {'posts': posts, 'page_obj': posts, 'username': username})

# 显示分类下的所有文章
def category_posts(request, category):
    posts = Post.objects.filter(category=category).order_by('-date_posted')
    
    # 分页
    paginator = Paginator(posts, 5)
    page = request.GET.get('page')
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        posts = paginator.page(1)
    except EmptyPage:
        posts = paginator.page(paginator.num_pages)
    
    return render(request, "posts/category_posts.html", {'posts': posts, 'page_obj': posts, 'category': category})

# API接口 - 用于异步加载文章
def api_posts(request):
    # 获取分页参数
    page = int(request.GET.get('page', 1))
    limit = int(request.GET.get('limit', 5))
    
    # 获取过滤参数
    category = request.GET.get('category', '')
    author = request.GET.get('author', '')
    search = request.GET.get('search', '')
    
    # 构建查询
    posts = Post.objects.all()
    
    if category:
        posts = posts.filter(category=category)
    
    if author:
        posts = posts.filter(author__username=author)
    
    if search:
        posts = posts.filter(
            Q(title__icontains=search) | 
            Q(content__icontains=search)
        )
    
    # 排序和分页
    posts = posts.order_by('-date_posted')
    paginator = Paginator(posts, limit)
    
    try:
        posts_page = paginator.page(page)
    except PageNotAnInteger:
        posts_page = paginator.page(1)
    except EmptyPage:
        posts_page = paginator.page(paginator.num_pages)
    
    # 构建响应数据
    data = {
        'posts': [
            {
                'id': post.id,
                'title': post.title,
                'content': post.content[:100] + '...' if len(post.content) > 100 else post.content,
                'date_posted': post.date_posted.strftime('%Y-%m-%d %H:%M:%S'),
                'author': post.author.username,
                'category': post.category,
                'likes': post.likes,
                'url': post.get_absolute_url()
            }
            for post in posts_page.object_list
        ],
        'has_next': posts_page.has_next(),
        'has_previous': posts_page.has_previous(),
        'page': posts_page.number,
        'total_pages': paginator.num_pages,
        'total_items': paginator.count
    }
    
    return JsonResponse(data)
