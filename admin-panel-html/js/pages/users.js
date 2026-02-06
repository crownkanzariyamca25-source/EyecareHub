// Users Page
function renderUsers() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h3>Users Management</h3>
                <div class="table-actions">
                    <div class="search-bar">
                        <input type="text" id="userSearch" placeholder="Search users..." oninput="searchUsers(this.value)">
                        <i class="fas fa-search"></i>
                    </div>
                    <button class="btn btn-primary" onclick="showAddUserModal()">
                        <i class="fas fa-user-plus"></i> Add User
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody">
                    ${mockData.users.map(user => `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <img src="https://ui-avatars.com/api/?name=${user.name}&background=random" 
                                         alt="${user.name}" 
                                         class="avatar">
                                    <strong>${user.name}</strong>
                                </div>
                            </td>
                            <td style="color: #6b7280;">${user.email}</td>
                            <td>
                                <span class="badge-status ${user.role === 'admin' ? 'shipped' : 'active'}">
                                    ${user.role}
                                </span>
                            </td>
                            <td><span class="badge-status ${user.status}">${user.status}</span></td>
                            <td>${user.joinedDate}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn view" onclick="viewUser('${user.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit" onclick="editUser('${user.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" onclick="toggleUserStatus('${user.id}')">
                                        <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Add/Edit User Modal -->
        <div id="userModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="userModalTitle">Add User</h3>
                    <button class="modal-close" onclick="closeUserModal()">&times;</button>
                </div>
                <form id="userForm" onsubmit="saveUser(event)">
                    <input type="hidden" id="userId">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Full Name *</label>
                            <input type="text" id="userName" required placeholder="John Doe">
                        </div>
                        <div class="form-group">
                            <label>Email Address *</label>
                            <input type="email" id="userEmail" required placeholder="john@example.com">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Role *</label>
                            <select id="userRole" required style="padding: 12px 15px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%;">
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Status *</label>
                            <select id="userStatus" required style="padding: 12px 15px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%;">
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Joined Date</label>
                        <input type="date" id="userJoinedDate" style="padding: 12px 15px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%;">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeUserModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save User
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- View User Modal -->
        <div id="viewUserModal" class="modal">
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-user-circle"></i> User Details</h3>
                    <button class="modal-close" onclick="closeViewUserModal()">&times;</button>
                </div>
                <div id="viewUserContent" style="padding: 20px 0;">
                    <!-- User details will be loaded here -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeViewUserModal()">Close</button>
                    <button class="btn btn-primary" onclick="editUserFromView()">
                        <i class="fas fa-edit"></i> Edit User
                    </button>
                </div>
            </div>
        </div>
    `;
}

let currentViewUserId = null;

function showAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'Add User';
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('userJoinedDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('userModal').classList.add('show');
}

function editUser(id) {
    const user = mockData.users.find(u => u.id === id);
    if (!user) return;

    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    document.getElementById('userJoinedDate').value = user.joinedDate;
    
    document.getElementById('userModal').classList.add('show');
}

function editUserFromView() {
    if (currentViewUserId) {
        closeViewUserModal();
        editUser(currentViewUserId);
    }
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('show');
    document.getElementById('userForm').reset();
}

function saveUser(event) {
    event.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        role: document.getElementById('userRole').value,
        status: document.getElementById('userStatus').value,
        joinedDate: document.getElementById('userJoinedDate').value,
        avatar: document.getElementById('userName').value.split(' ').map(n => n[0]).join('').toUpperCase()
    };

    if (userId) {
        // Edit existing user
        const index = mockData.users.findIndex(u => u.id === userId);
        if (index !== -1) {
            mockData.users[index] = { ...mockData.users[index], ...userData };
            showUserNotification('User updated successfully!', 'success');
        }
    } else {
        // Add new user
        const newUser = {
            id: (mockData.users.length + 1).toString(),
            ...userData
        };
        mockData.users.push(newUser);
        showUserNotification('User added successfully!', 'success');
    }

    closeUserModal();
    loadPage('users'); // Refresh the page
}

function viewUser(id) {
    const user = mockData.users.find(u => u.id === id);
    if (!user) return;

    currentViewUserId = id;

    const content = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
            <!-- User Avatar and Basic Info -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; color: white;">
                <img src="https://ui-avatars.com/api/?name=${user.name}&background=random&size=120" 
                     alt="${user.name}" 
                     style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid white; margin-bottom: 15px;">
                <h2 style="margin-bottom: 5px;">${user.name}</h2>
                <p style="opacity: 0.9; margin-bottom: 15px;">${user.email}</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <span class="badge-status ${user.role === 'admin' ? 'shipped' : 'active'}" style="background: white; color: var(--dark);">
                        <i class="fas fa-${user.role === 'admin' ? 'user-shield' : 'user'}"></i> ${user.role}
                    </span>
                    <span class="badge-status ${user.status}" style="background: white; color: var(--dark);">
                        <i class="fas fa-${user.status === 'active' ? 'check-circle' : 'ban'}"></i> ${user.status}
                    </span>
                </div>
            </div>

            <!-- User Information -->
            <div style="background: var(--light-bg); padding: 25px; border-radius: 12px;">
                <h4 style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-info-circle" style="color: var(--primary);"></i> Account Information
                </h4>
                <div style="display: grid; gap: 15px;">
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: white; border-radius: 8px;">
                        <span style="color: var(--gray);"><i class="fas fa-calendar"></i> Joined Date:</span>
                        <strong>${user.joinedDate}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: white; border-radius: 8px;">
                        <span style="color: var(--gray);"><i class="fas fa-id-card"></i> User ID:</span>
                        <strong>${user.id}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 12px; background: white; border-radius: 8px;">
                        <span style="color: var(--gray);"><i class="fas fa-envelope"></i> Email Verified:</span>
                        <strong style="color: var(--success);">
                            <i class="fas fa-check-circle"></i> Yes
                        </strong>
                    </div>
                </div>
            </div>

            <!-- Account Actions -->
            <div style="background: var(--light-bg); padding: 25px; border-radius: 12px;">
                <h4 style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-tools" style="color: var(--primary);"></i> Quick Actions
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                    <button class="btn btn-outline" onclick="editUser('${user.id}'); closeViewUserModal();">
                        <i class="fas fa-edit"></i> Edit Profile
                    </button>
                    <button class="btn btn-${user.status === 'active' ? 'danger' : 'success'}" onclick="toggleUserStatus('${user.id}'); closeViewUserModal();">
                        <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i> ${user.status === 'active' ? 'Block User' : 'Activate User'}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('viewUserContent').innerHTML = content;
    document.getElementById('viewUserModal').classList.add('show');
}

function closeViewUserModal() {
    document.getElementById('viewUserModal').classList.remove('show');
    currentViewUserId = null;
}

function toggleUserStatus(id) {
    const user = mockData.users.find(u => u.id === id);
    if (!user) return;

    const newStatus = user.status === 'active' ? 'blocked' : 'active';
    const action = newStatus === 'blocked' ? 'block' : 'activate';

    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
        const index = mockData.users.findIndex(u => u.id === id);
        if (index !== -1) {
            mockData.users[index].status = newStatus;
            showUserNotification(`User ${user.name} has been ${action}d successfully!`, 'success');
            loadPage('users'); // Refresh the page
        }
    }
}

function searchUsers(query) {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    const filtered = mockData.users.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
    );

    tbody.innerHTML = filtered.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://ui-avatars.com/api/?name=${user.name}&background=random" 
                         alt="${user.name}" 
                         class="avatar">
                    <strong>${user.name}</strong>
                </div>
            </td>
            <td style="color: #6b7280;">${user.email}</td>
            <td>
                <span class="badge-status ${user.role === 'admin' ? 'shipped' : 'active'}">
                    ${user.role}
                </span>
            </td>
            <td><span class="badge-status ${user.status}">${user.status}</span></td>
            <td>${user.joinedDate}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewUser('${user.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editUser('${user.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="toggleUserStatus('${user.id}')">
                        <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showUserNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-times-circle' : 'fa-info-circle';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
    `;
    
    notification.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
