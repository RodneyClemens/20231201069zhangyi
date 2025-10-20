// 无限滚动和滚动到底部检测功能

// 配置选项
const CONFIG = {
    // 距离底部多远时触发加载更多（像素）
    triggerDistance: 300,
    // 是否启用背景颜色变化效果
    enableBackgroundChange: true,
    // 是否启用无限滚动
    enableInfiniteScroll: true,
    // 加载中状态
    isLoading: false,
    // 当前加载的页码
    currentPage: 1,
    // 最大页码（用于演示）
    maxPages: 5
};

// 检测是否接近页面底部
export function isNearBottom(distance = CONFIG.triggerDistance) {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;
    const distanceToBottom = docHeight - (scrollY + winHeight);
    
    return distanceToBottom <= distance;
}

// 检测是否精确滚动到底部
export function isExactlyAtBottom(tolerance = 1) {
    const scrollY = window.scrollY;
    const winHeight = window.innerHeight;
    const docHeight = document.body.offsetHeight;
    
    return (scrollY + winHeight) >= (docHeight - tolerance);
}

// 处理滚动到底部时的背景颜色变化
function handleBackgroundChange() {
    if (!CONFIG.enableBackgroundChange) return;
    
    const body = document.querySelector('body');
    if (isExactlyAtBottom()) {
        // 滚动到底部，变为绿色
        body.style.backgroundColor = '#e8f5e9'; // 浅绿色，比纯白更醒目但不刺眼
        body.style.transition = 'background-color 0.3s ease';
    } else {
        // 未到底部，恢复白色
        body.style.backgroundColor = '#ffffff';
        body.style.transition = 'background-color 0.3s ease';
    }
}

// 创建加载指示器
function createLoadingIndicator() {
    let loadingIndicator = document.getElementById('loading-indicator');
    
    if (!loadingIndicator) {
        loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'loading-indicator';
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.style.display = 'none';
        loadingIndicator.style.textAlign = 'center';
        loadingIndicator.style.padding = '20px';
        loadingIndicator.style.fontSize = '16px';
        loadingIndicator.style.color = '#666';
        
        // 添加加载动画
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.border = '3px solid #f3f3f3';
        spinner.style.borderTop = '3px solid #4CAF50';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '30px';
        spinner.style.height = '30px';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.margin = '0 auto 10px';
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        loadingIndicator.appendChild(spinner);
        loadingIndicator.appendChild(document.createTextNode('加载中...'));
        
        // 添加到内容区域
        const contentArea = document.querySelector('#content');
        if (contentArea) {
            contentArea.appendChild(loadingIndicator);
        } else {
            document.body.appendChild(loadingIndicator);
        }
    }
    
    return loadingIndicator;
}

// 加载更多内容
async function loadMoreContent() {
    if (CONFIG.isLoading || CONFIG.currentPage >= CONFIG.maxPages) return;
    
    CONFIG.isLoading = true;
    const loadingIndicator = createLoadingIndicator();
    loadingIndicator.style.display = 'block';
    
    try {
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 模拟加载更多内容
        const contentArea = document.querySelector('#content');
        if (contentArea) {
            const newContent = document.createElement('div');
            newContent.className = 'loaded-content';
            newContent.style.backgroundColor = '#f9f9f9';
            newContent.style.padding = '20px';
            newContent.style.marginBottom = '20px';
            newContent.style.borderRadius = '8px';
            newContent.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            
            newContent.innerHTML = `
                <h3>加载的更多内容 - 第 ${CONFIG.currentPage + 1} 页</h3>
                <p>这是通过无限滚动加载的额外内容。在实际应用中，这里会显示从服务器获取的数据。</p>
                <p>当前页: ${CONFIG.currentPage + 1} / ${CONFIG.maxPages}</p>
                <p>示例内容段落。在真实场景中，这里可能包含文章、产品列表、评论等内容。</p>
                <p>滚动检测功能使用 window.scrollY + window.innerHeight >= document.body.offsetHeight 来判断是否到达页面底部。</p>
            `;
            
            // 插入到加载指示器之前
            contentArea.insertBefore(newContent, loadingIndicator);
            
            // 增加页码
            CONFIG.currentPage++;
            
            // 如果已达到最大页数，显示提示
            if (CONFIG.currentPage >= CONFIG.maxPages) {
                loadingIndicator.innerHTML = '<p>已加载全部内容</p>';
                setTimeout(() => {
                    loadingIndicator.style.display = 'none';
                }, 3000);
            }
        }
    } catch (error) {
        console.error('加载更多内容失败:', error);
        loadingIndicator.innerHTML = '<p>加载失败，请稍后重试</p>';
    } finally {
        CONFIG.isLoading = false;
        
        // 如果未达到最大页数，隐藏加载指示器
        if (CONFIG.currentPage < CONFIG.maxPages) {
            loadingIndicator.style.display = 'none';
        }
    }
}

// 处理滚动事件
function handleScroll() {
    // 更新背景颜色
    handleBackgroundChange();
    
    // 处理无限滚动
    if (CONFIG.enableInfiniteScroll && isNearBottom() && !CONFIG.isLoading) {
        loadMoreContent();
    }
}

// 设置滚动监听
export function setupInfiniteScroll(options = {}) {
    // 更新配置
    Object.assign(CONFIG, options);
    
    // 添加滚动事件监听
    window.addEventListener('scroll', handleScroll);
    
    console.log('无限滚动功能已初始化');
    return {
        // 暴露控制方法
        enable: () => {
            CONFIG.enableInfiniteScroll = true;
            CONFIG.enableBackgroundChange = true;
        },
        disable: () => {
            CONFIG.enableInfiniteScroll = false;
            CONFIG.enableBackgroundChange = false;
        },
        reset: () => {
            CONFIG.currentPage = 1;
            CONFIG.isLoading = false;
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        },
        // 手动触发加载更多
        loadMore: loadMoreContent
    };
}

// 清理函数，移除事件监听器
export function cleanupInfiniteScroll() {
    window.removeEventListener('scroll', handleScroll);
    console.log('无限滚动功能已清理');
}