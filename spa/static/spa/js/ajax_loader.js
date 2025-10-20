// 导入窗口尺寸监测功能
import { initWindowSizeFunctionality } from './window_size.js';
// 导入滚动监测功能
import { initScrollMonitoring } from './scroll_monitor.js';
// 导入无限滚动功能
import { setupInfiniteScroll, cleanupInfiniteScroll } from './infinite_scroll.js';

// When back arrow is clicked, show previous section
window.onpopstate = function(event) {
    if (event.state && event.state.section) {
        console.log('Back/forward button clicked, showing section:', event.state.section);
        showSection(event.state.section);
    }
}

// Shows given section
function showSection(section) {
    // Find section text from server
    fetch('/sections/' + section)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(text => {
        // Log text and display on page
        console.log('Loaded section content:', text);
        document.querySelector('#content').innerHTML = text;
        
        // 内容加载后更新窗口尺寸调整
        if (window.innerWidth) {
            adjustLayoutForWindowSize(window.innerWidth, window.innerHeight);
        }
        
        // 滚动到页面顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // 重置无限滚动状态
        if (infiniteScrollInstance) {
            infiniteScrollInstance.reset();
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        document.querySelector('#content').innerHTML = '<p>加载内容失败，请稍后再试。</p>';
    });
}

// 从URL中解析section编号
function getSectionFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/^\/section(\d+)$/);
    if (match && match[1]) {
        const sectionNum = parseInt(match[1]);
        if (sectionNum >= 1 && sectionNum <= 3) {
            return sectionNum;
        }
    }
    return 1; // 默认返回section 1
}

let infiniteScrollInstance;

document.addEventListener('DOMContentLoaded', function() {
    // 初始化窗口尺寸监测功能
    initWindowSizeFunctionality();
    // 初始化滚动监测功能
    initScrollMonitoring();
    // 初始化无限滚动功能
    infiniteScrollInstance = setupInfiniteScroll({
        triggerDistance: 300,
        enableBackgroundChange: true,
        enableInfiniteScroll: true,
        maxPages: 5
    });
    
    // 从URL中获取section编号，如果没有则使用默认值1
    const initialSection = getSectionFromUrl();
    
    // 初始加载对应的section内容
    showSection(initialSection);
    
    // 为初始状态添加历史记录条目
    history.replaceState({section: initialSection}, "", `section${initialSection}`);
    
    // Add button functionality
    document.querySelectorAll('button[data-section]').forEach(button => {
        button.onclick = function() {
            const section = this.dataset.section;
            
            // Add the current state to the history
            history.pushState({section: section}, "", `section${section}`);
            
            // Show the selected section
            showSection(section);
        };
    });
});