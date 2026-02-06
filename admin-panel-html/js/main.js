// Main Application Logic
const pageTitles = {
    dashboard: 'Dashboard',
    products: 'Products',
    categories: 'Categories',
    orders: 'Orders',
    users: 'Users',
    coupons: 'Discounts & Coupons',
    settings: 'Settings'
};

// Page rendering functions
const pageRenderers = {
    dashboard: renderDashboard,
    products: renderProducts,
    categories: renderCategories,
    orders: renderOrders,
    users: renderUsers,
    coupons: renderCoupons,
    settings: renderSettings
};

// Load page content
function loadPage(page) {
    const pageContent = document.getElementById('pageContent');
    const pageTitle = document.getElementById('pageTitle');
    
    // Update title
    pageTitle.textContent = pageTitles[page] || 'Dashboard';
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Render page content with animation
    gsap.to(pageContent, {
        opacity: 0,
        x: 20,
        duration: 0.2,
        onComplete: () => {
            pageContent.innerHTML = pageRenderers[page] ? pageRenderers[page]() : '<p>Page not found</p>';
            gsap.fromTo(pageContent,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.3 }
            );
        }
    });
}

// Navigation event listeners
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        loadPage(page);
    });
});

// Sidebar toggle for mobile
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

sidebarToggle?.addEventListener('click', function() {
    sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Show login screen initially
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
});
