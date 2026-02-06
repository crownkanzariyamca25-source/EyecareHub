// Orders Page
function renderOrders() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h3>Orders Management</h3>
                <div class="table-actions">
                    <div class="search-bar">
                        <input type="text" id="orderSearch" placeholder="Search orders..." oninput="searchOrders(this.value)">
                        <i class="fas fa-search"></i>
                    </div>
                    <select id="statusFilter" class="btn" style="padding: 10px 15px;" onchange="filterOrders(this.value)">
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="ordersTableBody">
                    ${mockData.orders.map(order => `
                        <tr>
                            <td><strong>${order.id}</strong></td>
                            <td>${order.customer}</td>
                            <td style="color: #6b7280; font-size: 0.9rem;">${order.email}</td>
                            <td>
                                <div style="font-size: 0.85rem;">
                                    ${order.products.map(p => `<div>• ${p}</div>`).join('')}
                                </div>
                            </td>
                            <td><strong>₹${order.total.toFixed(2)}</strong></td>
                            <td><span class="badge-status ${order.status}">${order.status}</span></td>
                            <td>${order.date}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn view" onclick="viewOrder('${order.id}')">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="action-btn edit" onclick="editOrder('${order.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- View Order Modal -->
        <div id="viewOrderModal" class="modal">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3><i class="fas fa-receipt"></i> Order Details</h3>
                    <button class="modal-close" onclick="closeViewOrderModal()">&times;</button>
                </div>
                <div id="orderDetailsContent" style="padding: 20px 0;">
                    <!-- Order details will be loaded here -->
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="closeViewOrderModal()">Close</button>
                </div>
            </div>
        </div>

        <!-- Edit Order Modal -->
        <div id="editOrderModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-edit"></i> Edit Order Status</h3>
                    <button class="modal-close" onclick="closeEditOrderModal()">&times;</button>
                </div>
                <form id="editOrderForm" onsubmit="saveOrderStatus(event)">
                    <input type="hidden" id="editOrderId">
                    <div style="background: var(--light-bg); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                            <div>
                                <strong>Order ID:</strong>
                                <div id="editOrderIdDisplay" style="color: var(--gray);"></div>
                            </div>
                            <div>
                                <strong>Customer:</strong>
                                <div id="editOrderCustomer" style="color: var(--gray);"></div>
                            </div>
                            <div>
                                <strong>Total:</strong>
                                <div id="editOrderTotal" style="color: var(--gray);"></div>
                            </div>
                            <div>
                                <strong>Date:</strong>
                                <div id="editOrderDate" style="color: var(--gray);"></div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Order Status *</label>
                        <select id="editOrderStatus" required style="padding: 12px 15px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%;">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Notes (Optional)</label>
                        <textarea id="editOrderNotes" rows="3" placeholder="Add any notes about this status change..." style="padding: 12px 15px; border: 2px solid var(--border); border-radius: 8px; font-size: 1rem; width: 100%; font-family: inherit;"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeEditOrderModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Update Status
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function filterOrders(status) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const filtered = status === 'all' 
        ? mockData.orders 
        : mockData.orders.filter(order => order.status === status);

    updateOrdersTable(filtered);
    showOrderNotification(`Showing ${filtered.length} ${status === 'all' ? 'total' : status} orders`, 'info');
}

function searchOrders(query) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const filtered = mockData.orders.filter(order => 
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customer.toLowerCase().includes(query.toLowerCase()) ||
        order.email.toLowerCase().includes(query.toLowerCase()) ||
        order.products.some(p => p.toLowerCase().includes(query.toLowerCase()))
    );

    updateOrdersTable(filtered);
}

function updateOrdersTable(orders) {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>${order.id}</strong></td>
            <td>${order.customer}</td>
            <td style="color: #6b7280; font-size: 0.9rem;">${order.email}</td>
            <td>
                <div style="font-size: 0.85rem;">
                    ${order.products.map(p => `<div>• ${p}</div>`).join('')}
                </div>
            </td>
            <td><strong>₹${order.total.toFixed(2)}</strong></td>
            <td><span class="badge-status ${order.status}">${order.status}</span></td>
            <td>${order.date}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewOrder('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editOrder('${order.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function viewOrder(id) {
    const order = mockData.orders.find(o => o.id === id);
    if (!order) return;

    const content = `
        <div style="display: grid; gap: 20px;">
            <!-- Order Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px; color: white;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h2 style="margin-bottom: 5px;">${order.id}</h2>
                        <p style="opacity: 0.9; margin: 0;">Placed on ${order.date}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 2rem; font-weight: bold;">₹${order.total.toFixed(2)}</div>
                        <span class="badge-status ${order.status}" style="background: white; color: var(--dark); margin-top: 10px;">
                            ${order.status}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Customer Information -->
            <div style="background: var(--light-bg); padding: 20px; border-radius: 12px;">
                <h4 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-user" style="color: var(--primary);"></i> Customer Information
                </h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <strong>Name:</strong>
                        <div style="color: var(--gray); margin-top: 5px;">${order.customer}</div>
                    </div>
                    <div>
                        <strong>Email:</strong>
                        <div style="color: var(--gray); margin-top: 5px;">${order.email}</div>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <div style="background: var(--light-bg); padding: 20px; border-radius: 12px;">
                <h4 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-shopping-bag" style="color: var(--primary);"></i> Order Items
                </h4>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${order.products.map(product => `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; background: white; border-radius: 8px;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <i class="fas fa-glasses" style="color: var(--primary); font-size: 1.2rem;"></i>
                                <span>${product}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Order Summary -->
            <div style="background: var(--light-bg); padding: 20px; border-radius: 12px;">
                <h4 style="margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                    <i class="fas fa-file-invoice-dollar" style="color: var(--primary);"></i> Order Summary
                </h4>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Items (${order.products.length})</span>
                        <span>₹${order.total.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Shipping</span>
                        <span style="color: var(--success);">Free</span>
                    </div>
                    <div style="border-top: 2px solid var(--border); margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: bold;">
                        <span>Total</span>
                        <span style="color: var(--primary);">₹${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById('orderDetailsContent').innerHTML = content;
    document.getElementById('viewOrderModal').classList.add('show');
}

function closeViewOrderModal() {
    document.getElementById('viewOrderModal').classList.remove('show');
}

function editOrder(id) {
    const order = mockData.orders.find(o => o.id === id);
    if (!order) return;

    document.getElementById('editOrderId').value = order.id;
    document.getElementById('editOrderIdDisplay').textContent = order.id;
    document.getElementById('editOrderCustomer').textContent = order.customer;
    document.getElementById('editOrderTotal').textContent = '₹' + order.total.toFixed(2);
    document.getElementById('editOrderDate').textContent = order.date;
    document.getElementById('editOrderStatus').value = order.status;
    document.getElementById('editOrderNotes').value = '';
    
    document.getElementById('editOrderModal').classList.add('show');
}

function closeEditOrderModal() {
    document.getElementById('editOrderModal').classList.remove('show');
    document.getElementById('editOrderForm').reset();
}

function saveOrderStatus(event) {
    event.preventDefault();
    
    const orderId = document.getElementById('editOrderId').value;
    const newStatus = document.getElementById('editOrderStatus').value;
    const notes = document.getElementById('editOrderNotes').value;
    
    const index = mockData.orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
        const oldStatus = mockData.orders[index].status;
        mockData.orders[index].status = newStatus;
        
        showOrderNotification(`Order ${orderId} status updated from "${oldStatus}" to "${newStatus}"`, 'success');
        closeEditOrderModal();
        loadPage('orders'); // Refresh the page
    }
}

function showOrderNotification(message, type = 'success') {
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
