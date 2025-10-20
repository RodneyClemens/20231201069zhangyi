// 滚动监测和交互功能演示

// 显示滚动信息
function displayScrollInfo() {
    // 获取滚动位置和文档高度
    const scrollY = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    
    // 计算滚动百分比
    const scrollPercent = Math.min((scrollY / (docHeight - winHeight)) * 100, 100);
    
    // 创建或更新滚动信息显示元素
    let scrollInfo = document.getElementById('scroll-info');
    if (!scrollInfo) {
        scrollInfo = document.createElement('div');
        scrollInfo.id = 'scroll-info';
        scrollInfo.className = 'scroll-info-display';
        scrollInfo.style.position = 'fixed';
        scrollInfo.style.top = '20px';
        scrollInfo.style.right = '20px';
        scrollInfo.style.padding = '10px 15px';
        scrollInfo.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        scrollInfo.style.color = 'white';
        scrollInfo.style.borderRadius = '5px';
        scrollInfo.style.fontFamily = 'monospace';
        scrollInfo.style.zIndex = '1000';
        scrollInfo.style.fontSize = '14px';
        document.body.appendChild(scrollInfo);
    }
    
    // 更新显示内容
    scrollInfo.innerHTML = `
        滚动位置: ${Math.round(scrollY)}px<br>
        文档高度: ${Math.round(docHeight)}px<br>
        窗口高度: ${Math.round(winHeight)}px<br>
        滚动进度: ${Math.round(scrollPercent)}%
    `;
    
    // 更新滚动进度条
    updateScrollProgressBar(scrollPercent);
    
    // 根据滚动位置执行交互效果
    handleScrollBasedInteractions(scrollY, scrollPercent);
}

// 创建和更新滚动进度条
function updateScrollProgressBar(percent) {
    let progressBar = document.getElementById('scroll-progress-bar');
    
    if (!progressBar) {
        // 创建进度条容器
        const progressContainer = document.createElement('div');
        progressContainer.id = 'scroll-progress-container';
        progressContainer.style.position = 'fixed';
        progressContainer.style.top = '0';
        progressContainer.style.left = '0';
        progressContainer.style.width = '100%';
        progressContainer.style.height = '4px';
        progressContainer.style.backgroundColor = 'rgba(200, 200, 200, 0.3)';
        progressContainer.style.zIndex = '9999';
        document.body.appendChild(progressContainer);
        
        // 创建进度条
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress-bar';
        progressBar.style.height = '100%';
        progressBar.style.backgroundColor = '#4CAF50';
        progressBar.style.width = '0%';
        progressBar.style.transition = 'width 0.1s ease-out';
        progressContainer.appendChild(progressBar);
    }
    
    // 更新进度条宽度
    progressBar.style.width = `${percent}%`;
}

// 处理基于滚动位置的交互效果
function handleScrollBasedInteractions(scrollY, scrollPercent) {
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (scrollY > 100) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            navbar.style.padding = '10px 0';
            navbar.style.transition = 'all 0.3s ease';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '20px 0';
            navbar.style.transition = 'all 0.3s ease';
        }
    }
    
    // 回到顶部按钮显示/隐藏
    let backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.textContent = '↑';
        backToTopBtn.style.position = 'fixed';
        backToTopBtn.style.bottom = '80px';
        backToTopBtn.style.right = '20px';
        backToTopBtn.style.width = '50px';
        backToTopBtn.style.height = '50px';
        backToTopBtn.style.borderRadius = '50%';
        backToTopBtn.style.border = 'none';
        backToTopBtn.style.backgroundColor = '#4CAF50';
        backToTopBtn.style.color = 'white';
        backToTopBtn.style.fontSize = '24px';
        backToTopBtn.style.cursor = 'pointer';
        backToTopBtn.style.zIndex = '1000';
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transition = 'opacity 0.3s ease';
        backToTopBtn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        
        // 添加回到顶部功能
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(backToTopBtn);
    }
    
    // 根据滚动位置显示/隐藏回到顶部按钮
    if (scrollPercent > 20) {
        backToTopBtn.style.opacity = '1';
    } else {
        backToTopBtn.style.opacity = '0';
    }
    
    // 视差滚动效果（如果有相关元素）
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollY * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
}

// 平滑滚动到指定元素
function scrollToElement(elementId, offset = 0) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: elementPosition + offset,
            behavior: 'smooth'
        });
    }
}

// 监听滚动事件
function setupScrollListener() {
    window.addEventListener('scroll', function() {
        // 使用防抖技术避免频繁更新
        if (this.scrollTimer) clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(function() {
            displayScrollInfo();
        }, 50);
    });
}

// 页面加载时初始化
export function initScrollMonitoring() {
    // 初始显示滚动信息
    displayScrollInfo();
    
    // 设置滚动监听
    setupScrollListener();
    
    // 导出滚动到元素的方法供外部使用
    window.scrollToElement = scrollToElement;
    
    console.log('滚动监测功能已初始化');
}

// 计算到页面底部的距离
export function getDistanceToBottom() {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;
    return Math.max(docHeight - (scrollY + winHeight), 0);
}

// 判断是否滚动到底部
export function isAtBottom(tolerance = 100) {
    return getDistanceToBottom() <= tolerance;
}