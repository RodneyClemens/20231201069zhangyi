from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content', 'category', 'tags']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '文章标题'}),
            'content': forms.Textarea(attrs={'class': 'form-control', 'placeholder': '文章内容', 'rows': 10}),
            'category': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '分类'}),
            'tags': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '标签，用逗号分隔'}),
        }
        labels = {
            'title': '标题',
            'content': '内容',
            'category': '分类',
            'tags': '标签',
        }
    
    def clean_tags(self):
        tags = self.cleaned_data.get('tags')
        # 可以在这里添加标签的验证逻辑
        return tags