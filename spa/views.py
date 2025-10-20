from django.http import Http404, HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'spa/index.html')

# The texts are much longer in reality, but have
# been shortened here to save space
texts = [
    "这是首页的内容。在实际应用中，这里会包含网站的主要信息、最新动态或者推荐内容。使用AJAX技术，我们可以按需加载这部分内容，而不需要在初始页面加载时就包含所有信息。",
    "这是关于我们页面的内容。这里可以介绍公司或团队的背景、使命、愿景和价值观。通过动态加载，我们可以在用户需要时才获取这些详细信息。",
    "这是联系方式页面的内容。包含电话、邮箱、地址等联系信息，以及一个联系表单。这种方式确保用户能够方便地与我们取得联系。"
]

def section(request, num):
    if 1 <= num <= 3:
        return HttpResponse(texts[num - 1])
    else:
        raise Http404("No such section")

def game(request):
    return render(request, 'spa/game.html')
