// 博客系统前端交互脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化搜索框自动完成功能
    initSearchAutoComplete();
    
    // 初始化平滑滚动
    initSmoothScroll();
    
    // 初始化加载更多功能（如果需要）
    // initLoadMore();
    
    // 初始化卡片悬停动画
    initCardAnimations();
    
    // 初始化表单验证
    initFormValidation();
});

// 搜索框自动完成功能
function initSearchAutoComplete() {
    const searchInput = document.querySelector('input[name="q"]');
    if (!searchInput) return;
    
    let debounceTimer;
    searchInput.addEventListener('input', function() {
        clearTimeout(debounceTimer);
        
        const query = this.value.trim();
        if (query.length < 2) {
            hideSearchSuggestions();
            return;
        }
        
        debounceTimer = setTimeout(() => {
            // 这里可以添加搜索建议API调用
            // fetch(`/posts/api/search-suggestions/?q=${query}`)
            // .then(response => response.json())
            // .then(data => showSearchSuggestions(data.suggestions))
            // .catch(error => console.error('搜索建议加载失败:', error));
        }, 300);
    });
    
    // 点击其他地方隐藏搜索建议
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.search-container')) {
            hideSearchSuggestions();
        }
    });
}

// 显示搜索建议
function showSearchSuggestions(suggestions) {
    // 实现搜索建议下拉框
    const container = document.createElement('div');
    container.className = 'search-suggestions';
    container.innerHTML = suggestions.map(s => `<div class="suggestion-item">${s}</div>`).join('');
    
    // 将建议框添加到搜索框下方
    const searchInput = document.querySelector('input[name="q"]');
    searchInput.parentNode.appendChild(container);
}

// 隐藏搜索建议
function hideSearchSuggestions() {
    const suggestions = document.querySelector('.search-suggestions');
    if (suggestions) suggestions.remove();
}

// 平滑滚动功能
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 考虑导航栏高度
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 加载更多文章功能
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (!loadMoreBtn) return;
    
    let isLoading = false;
    let currentPage = 1;
    
    loadMoreBtn.addEventListener('click', function() {
        if (isLoading) return;
        
        isLoading = true;
        this.innerHTML = '<span class="loading-spinner"></span> 加载中...';
        
        const nextPage = currentPage + 1;
        const searchQuery = new URLSearchParams(window.location.search).get('q') || '';
        const category = new URLSearchParams(window.location.search).get('category') || '';
        
        let url = `/posts/api/posts/?page=${nextPage}`;
        if (searchQuery) url += `&search=${searchQuery}`;
        if (category) url += `&category=${category}`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.posts && data.posts.length > 0) {
                    const articleList = document.querySelector('.article-list');
                    data.posts.forEach(post => {
                        const postCard = createPostCard(post);
                        articleList.appendChild(postCard);
                    });
                    
                    currentPage = nextPage;
                    
                    // 如果没有更多页，隐藏加载按钮
                    if (!data.has_next) {
                        this.textContent = '没有更多文章了';
                        this.disabled = true;
                    }
                }
            })
            .catch(error => {
                console.error('加载更多文章失败:', error);
            })
            .finally(() => {
                isLoading = false;
                this.innerHTML = '加载更多';
            });
    });
}

// 创建文章卡片
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'card mb-4 card-hover';
    
    let categoryHtml = '';
    if (post.category) {
        categoryHtml = `<div class="mb-2"><span class="badge bg-primary">${post.category}</span></div>`;
    }
    
    card.innerHTML = `
        <div class="card-body">
            ${categoryHtml}
            <h2 class="card-title"><a href="${post.url}" class="text-decoration-none text-dark">${post.title}</a></h2>
            <p class="card-text text-muted">
                <small>作者: <a href="/posts/user/${post.author}/" class="text-primary">${post.author}</a> | 
                发布时间: ${post.date_posted}</small>
            </p>
            <p class="card-text">${post.content}</p>
            <a href="${post.url}" class="btn btn-primary">阅读更多</a>
        </div>
    `;
    
    return card;
}

// 卡片悬停动画增强
function initCardAnimations() {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        });
    });
}

// 表单验证功能
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    field.addEventListener('input', function() {
                        this.classList.remove('is-invalid');
                    }, { once: true });
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                alert('请填写所有必填字段');
            }
        });
    });
}

// 移动端菜单切换
function toggleMobileMenu() {
    const navbarNav = document.querySelector('.navbar-nav');
    navbarNav.classList.toggle('show');
}

// 响应式处理
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const navbarNav = document.querySelector('.navbar-nav');
        if (navbarNav && navbarNav.classList.contains('show')) {
            navbarNav.classList.remove('show');
        }
    }
});

// 分享功能（占位）
function sharePost(postId) {
    // 实现社交媒体分享功能
    alert('分享功能开发中');
}

// 返回顶部按钮
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'btn btn-primary fixed-bottom right-3 bottom-3 rounded-full p-3 shadow-lg';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.style.display = 'none';
    backToTopBtn.title = '返回顶部';
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
}

// 延迟初始化返回顶部按钮
setTimeout(initBackToTop, 1000);