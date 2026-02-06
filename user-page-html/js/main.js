// Main Application Logic
const pageRenderers = {
    home: renderHome,
    products: renderProducts,
    'product-detail': renderProductDetail,
    about: renderAbout,
    contact: renderContact,
    checkout: renderCheckout,
    profile: renderProfile,
    orders: renderOrders
};

function loadPage(page) {
    const mainContent = document.getElementById('mainContent');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });
    
    // Render page with animation
    gsap.to(mainContent, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        onComplete: () => {
            window.scrollTo(0, 0);
            mainContent.innerHTML = pageRenderers[page] ? pageRenderers[page]() : renderHome();
            gsap.fromTo(mainContent,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.3 }
            );
        }
    });
    
    // Close mobile menu if open
    closeMobileMenu();
}

function closeMobileMenu() {
    // Mobile menu logic here if needed
}

// Navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.dataset.page;
        loadPage(page);
    });
});

// Footer links
document.querySelectorAll('.footer a[data-page]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        loadPage(this.dataset.page);
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPage('home');
    updateCartUI();
    updateUserUI();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
