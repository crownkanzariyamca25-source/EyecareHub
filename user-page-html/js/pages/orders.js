// Orders Page
function renderOrders() {
    if (!isAuthenticated()) {
        return `
            <section class="section">
                <div class="container">
                    <div style="text-align: center; padding: 100px 20px;">
                        <i class="fas fa-user-lock" style="font-size: 4rem; color: var(--gray); margin-bottom: 20px;"></i>
                        <h2>Please Login</h2>
                        <p style="color: var(--gray); margin: 20px 0;">You need to be logged in to view your orders</p>
                        <button class="btn btn-primary btn-lg" onclick="loadPage('login')">
                            Login
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
    
    const orders = JSON.parse(localStorage.getItem('eyecare_orders')) || [];
    
    return `
        <section class="section">
            <div class="container">
                <h2 style="margin-bottom: 30px;">My Orders</h2>
                
                ${orders.length === 0 ? `
                    <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 12px;">
                        <i class="fas fa-box-open" style="font-size: 4rem; color: var(--gray); margin-bottom: 20px;"></i>
                        <h3>No Orders Yet</h3>
                        <p style="color: var(--gray); margin: 20px 0;">You haven't placed any orders yet</p>
                        <button class="btn btn-primary btn-lg" onclick="loadPage('products')">
                            Start Shopping
                        </button>
                    </div>
                ` : `
                    <div style="background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                        <table class="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Date</th>
                                    <th>Items</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orders.reverse().map(order => `
                                    <tr>
                                        <td><strong>${order.id}</strong></td>
                                        <td>${order.date}</td>
                                        <td>${order.items.length} item(s)</td>
                                        <td>₹${order.total}</td>
                                        <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                                        <td>
                                            <button class="btn btn-sm btn-outline" onclick="viewOrderDetails('${order.id}')">
                                                <i class="fas fa-eye"></i> View
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `}
            </div>
        </section>
    `;
}

function viewOrderDetails(orderId) {
    alert('View order details: ' + orderId);
}
