// Authentication
const auth = {
    isAuthenticated: false,
    currentUser: null
};

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple authentication (username: admin, password: admin)
    if (username === 'admin' && password === 'admin') {
        auth.isAuthenticated = true;
        auth.currentUser = { username: 'Admin', role: 'admin' };
        
        // Animate login transition
        gsap.to('#loginScreen', {
            opacity: 0,
            scale: 0.95,
            duration: 0.3,
            onComplete: () => {
                document.getElementById('loginScreen').classList.add('hidden');
                document.getElementById('adminPanel').classList.remove('hidden');
                gsap.from('#adminPanel', {
                    opacity: 0,
                    duration: 0.4
                });
                loadPage('dashboard');
            }
        });
    } else {
        alert('Invalid credentials! Use username: admin, password: admin');
    }
});

// Logout handler
document.getElementById('logoutBtn')?.addEventListener('click', function() {
    gsap.to('#adminPanel', {
        opacity: 0,
        scale: 0.98,
        duration: 0.3,
        onComplete: () => {
            auth.isAuthenticated = false;
            auth.currentUser = null;
            document.getElementById('adminPanel').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
            document.getElementById('loginForm').reset();
            gsap.from('#loginScreen', {
                opacity: 0,
                duration: 0.4
            });
        }
    });
});

// Switch to user mode
document.getElementById('switchToUser')?.addEventListener('click', function() {
    window.location.href = '../user-page-html/index.html';
});
