// Profile/Dashboard Page
function renderProfile() {
    if (!isAuthenticated()) {
        return `
            <section class="section">
                <div class="container">
                    <div style="text-align: center; padding: 100px 20px;">
                        <i class="fas fa-user-lock" style="font-size: 4rem; color: var(--gray); margin-bottom: 20px;"></i>
                        <h2>Please Login</h2>
                        <p style="color: var(--gray); margin: 20px 0;">You need to be logged in to view your profile</p>
                        <button class="btn btn-primary btn-lg" onclick="loadPage('login')">
                            Login
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
    
    return `
        <section class="section">
            <div class="container">
                <h2 style="margin-bottom: 30px;">My Dashboard</h2>
                <div class="dashboard-grid">
                    <div class="sidebar-menu">
                        <div class="menu-item active">
                            <i class="fas fa-user"></i> Profile
                        </div>
                        <div class="menu-item" onclick="loadPage('orders')">
                            <i class="fas fa-box"></i> Orders
                        </div>
                        <div class="menu-item" onclick="logout()">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </div>
                    </div>
                    
                    <div class="dashboard-content">
                        <h3 style="margin-bottom: 30px;">Profile Information</h3>
                        <form onsubmit="updateProfile(event)">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Full Name</label>
                                    <input type="text" value="${currentUser.name}">
                                </div>
                                <div class="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value="${currentUser.email}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" placeholder="+1 (555) 123-4567">
                                </div>
                                <div class="form-group">
                                    <label>Date of Birth</label>
                                    <input type="date">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function updateProfile(event) {
    event.preventDefault();
    showNotification('Profile updated successfully!');
}
