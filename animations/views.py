from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "animations/index.html")

def animation_types(request):
    return render(request, "animations/animation_types.html")

def interactive_animations(request):
    return render(request, "animations/interactive_animations.html")
