// Authentication
let currentUser = JSON.parse(localStorage.getItem('eyecare_user')) || null;

function login(email, password) {
    // Simple authentication (in production, this would be an API call)
    if (email && password) {
        currentUser = {
            name: 'John Doe',
            email: email,
            id: '1'
        };
        localStorage.setItem('eyecare_user', JSON.stringify(currentUser));
        updateUserUI();
        showNotification('Login successful!');
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('eyecare_user');
    updateUserUI();
    showNotification('Logged out successfully!');
    loadPage('home');
}

function register(name, email, password) {
    // Simple registration
    currentUser = {
        name: name,
        email: email,
        id: Date.now().toString()
    };
    localStorage.setItem('eyecare_user', JSON.stringify(currentUser));
    updateUserUI();
    showNotification('Registration successful!');
    return true;
}

function isAuthenticated() {
    return currentUser !== null;
}

function updateUserUI() {
    const userMenuContent = document.getElementById('userMenuContent');
    if (!userMenuContent) return;
    
    if (isAuthenticated()) {
        userMenuContent.innerHTML = `
            <div class="user-menu-item" onclick="loadPage('profile')">
                <i class="fas fa-user"></i> My Profile
            </div>
            <div class="user-menu-item" onclick="loadPage('orders')">
                <i class="fas fa-box"></i> My Orders
            </div>
            <div class="user-menu-item" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> Logout
            </div>
        `;
    } else {
        userMenuContent.innerHTML = `
            <div class="user-menu-item" onclick="loadPage('login')">
                <i class="fas fa-sign-in-alt"></i> Login
            </div>
            <div class="user-menu-item" onclick="loadPage('register')">
                <i class="fas fa-user-plus"></i> Register
            </div>
        `;
    }
}

// User menu toggle
document.getElementById('userBtn')?.addEventListener('click', function() {
    const userMenu = document.getElementById('userMenu');
    const overlay = document.getElementById('overlay');
    userMenu.classList.toggle('show');
    if (userMenu.classList.contains('show')) {
        overlay.classList.add('show');
    }
});

// Initialize
updateUserUI();
