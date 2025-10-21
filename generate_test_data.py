# 生成测试博客数据的脚本
import os
import django
import random
from datetime import datetime, timedelta

# 设置Django环境
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')
django.setup()

from django.contrib.auth import get_user_model
from posts.models import Post

# 模拟文章标题
TITLES = [
    "Django博客系统搭建教程",
    "Python Web开发最佳实践",
    "使用Bootstrap构建响应式网站",
    "Django ORM高级查询技巧",
    "前端性能优化指南",
    "RESTful API设计原则",
    "Django认证系统详解",
    "Python数据分析入门",
    "Git版本控制实用指南",
    "数据库设计的艺术"
]

# 模拟文章内容
CONTENTS = [
    "在这篇文章中，我们将详细介绍如何使用Django框架搭建一个完整的博客系统。从环境配置到项目部署，一步一步教你掌握Django开发技能。\n\nDjango是一个高级Python Web框架，它鼓励快速开发和简洁实用的设计。它自带了管理后台、ORM、表单处理等功能，让开发者可以专注于业务逻辑而不是基础设施。\n\n通过本文的学习，你将能够独立开发一个功能完善的博客系统，包括文章的创建、编辑、删除、分类、标签等功能。",
    "Python是一种广泛使用的解释型、高级和通用的编程语言。它的设计哲学强调代码的可读性和简洁的语法。\n\n在Web开发领域，Python有许多优秀的框架，如Django、Flask、FastAPI等。这些框架大大提高了开发效率，让开发者能够快速构建高质量的Web应用。\n\n本文将介绍Python Web开发的一些最佳实践，包括项目结构设计、代码组织、数据库优化等方面。",
    "Bootstrap是一个流行的前端框架，它提供了一套完整的CSS、JavaScript组件，让开发者可以快速构建响应式、移动优先的网站。\n\n使用Bootstrap可以大大减少前端开发的工作量，同时保证网站在不同设备上都有良好的显示效果。\n\n本文将介绍Bootstrap的基本使用方法，包括栅格系统、组件使用、自定义样式等内容。"
]

# 模拟分类
CATEGORIES = ["技术", "教程", "分享", "笔记", "其他"]

# 模拟标签
TAGS = ["Django", "Python", "Web开发", "前端", "后端", "数据库", "Git", "Linux"]

def generate_test_posts():
    """生成测试博客文章"""
    # 获取或创建测试用户
    User = get_user_model()
    try:
        user = User.objects.get(username='admin')
    except User.DoesNotExist:
        print("管理员用户不存在，请先创建超级用户")
        return
    
    # 生成20篇测试文章
    for i in range(20):
        # 随机选择标题、内容、分类
        title = random.choice(TITLES)
        if i >= 10:  # 如果标题不够，添加序号区分
            title = f"{title} (续{i-9})"
        
        content = random.choice(CONTENTS)
        category = random.choice(CATEGORIES)
        
        # 随机选择2-3个标签
        num_tags = random.randint(2, 3)
        post_tags = random.sample(TAGS, num_tags)
        tags_str = ", ".join(post_tags)
        
        # 随机生成发布时间（最近30天内）
        days_ago = random.randint(0, 30)
        date_posted = datetime.now() - timedelta(days=days_ago)
        
        # 创建文章
        post = Post.objects.create(
            title=title,
            content=content,
            author=user,
            category=category,
            tags=tags_str,
            date_posted=date_posted,
            likes=random.randint(0, 100)
        )
        
        print(f"创建文章: {post.title}")
    
    print(f"\n成功创建 {Post.objects.count()} 篇测试文章")

if __name__ == "__main__":
    print("开始生成测试博客数据...")
    generate_test_posts()
    print("测试数据生成完成！")