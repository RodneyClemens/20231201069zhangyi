// 窗口尺寸监测和响应式设计演示

// 显示当前窗口尺寸
function displayWindowSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 创建或更新尺寸显示元素
    let sizeDisplay = document.getElementById('window-size-info');
    if (!sizeDisplay) {
        sizeDisplay = document.createElement('div');
        sizeDisplay.id = 'window-size-info';
        sizeDisplay.className = 'window-size-display';
        sizeDisplay.style.position = 'fixed';
        sizeDisplay.style.bottom = '20px';
        sizeDisplay.style.right = '20px';
        sizeDisplay.style.padding = '10px 15px';
        sizeDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        sizeDisplay.style.color = 'white';
        sizeDisplay.style.borderRadius = '5px';
        sizeDisplay.style.fontFamily = 'monospace';
        sizeDisplay.style.zIndex = '1000';
        sizeDisplay.style.fontSize = '14px';
        document.body.appendChild(sizeDisplay);
    }
    
    sizeDisplay.textContent = `窗口尺寸: ${width}px × ${height}px`;
    
    // 根据窗口大小调整页面样式
    adjustLayoutForWindowSize(width, height);
}

// 根据窗口大小调整布局
export function adjustLayoutForWindowSize(width, height) {
    const contentArea = document.querySelector('.content');
    if (!contentArea) return;
    
    // 设置响应式内容宽度
    if (width < 768) {
        // 移动设备布局
        contentArea.style.maxWidth = '95%';
        contentArea.style.padding = '10px';
        
        // 调整导航按钮布局
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            navButtons.style.flexDirection = 'column';
            navButtons.style.gap = '5px';
        }
    } else if (width < 1024) {
        // 平板设备布局
        contentArea.style.maxWidth = '800px';
        contentArea.style.padding = '20px';
        
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            navButtons.style.flexDirection = 'row';
            navButtons.style.gap = '10px';
        }
    } else {
        // 桌面设备布局
        contentArea.style.maxWidth = '1000px';
        contentArea.style.padding = '30px';
        
        const navButtons = document.querySelector('.nav-buttons');
        if (navButtons) {
            navButtons.style.flexDirection = 'row';
            navButtons.style.gap = '15px';
        }
    }
    
    // 设置动态内容区域的最小高度，确保页脚始终在底部
    const dynamicContent = document.querySelector('.dynamic-content');
    if (dynamicContent) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const footerHeight = document.querySelector('.footer').offsetHeight;
        const minHeight = height - navbarHeight - footerHeight - 100; // 减去一些额外的间距
        dynamicContent.style.minHeight = Math.max(minHeight, 300) + 'px'; // 确保最小高度为300px
    }
}

// 监听窗口大小变化事件
function setupWindowResizeListener() {
    window.addEventListener('resize', function() {
        // 使用防抖技术避免频繁更新
        if (this.resizeTimer) clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(function() {
            displayWindowSize();
        }, 200);
    });
}

// 页面加载时初始化
export function initWindowSizeFunctionality() {
    // 初始显示窗口尺寸
    displayWindowSize();
    
    // 设置尺寸变化监听
    setupWindowResizeListener();
    
    console.log('窗口尺寸监测功能已初始化');
}