// Shows one page and hides the other two 
function showPage(page) {
    // Hide all page content divs (only those with id starting with "page"):
    document.querySelectorAll('div[id^="page"]').forEach(div => {
        div.style.display = 'none';
    });

    // Show the div provided in the argument 
    document.querySelector(`#${page}`).style.display = 'block';
}

// Wait for page to loaded:
document.addEventListener('DOMContentLoaded', function() {
    // 初始显示第一个页面
    const firstButton = document.querySelector('button[data-page]');
    if (firstButton) {
        showPage(firstButton.dataset.page);
    }

    // Select all buttons 
    document.querySelectorAll('button').forEach(button => {
        // When a button is clicked, switch to that page 
        button.onclick = function() {
            if (this.dataset.page) {
                showPage(this.dataset.page);
            }
        }
    });
});