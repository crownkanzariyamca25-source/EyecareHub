// Dashboard Page
function renderDashboard() {
    const stats = getStats();
    
    return `
        <div class="stats-grid">
            <div class="stat-card revenue">
                <div class="stat-info">
                    <h3>$${stats.revenue}</h3>
                    <p>Total Revenue</p>
                </div>
                <i class="fas fa-dollar-sign stat-icon"></i>
            </div>
            <div class="stat-card orders">
                <div class="stat-info">
                    <h3>${stats.orders}</h3>
                    <p>Total Orders</p>
                </div>
                <i class="fas fa-shopping-cart stat-icon"></i>
            </div>
            <div class="stat-card users">
                <div class="stat-info">
                    <h3>${stats.users}</h3>
                    <p>Total Users</p>
                </div>
                <i class="fas fa-users stat-icon"></i>
            </div>
            <div class="stat-card products">
                <div class="stat-info">
                    <h3>${stats.products}</h3>
                    <p>Total Products</p>
                </div>
                <i class="fas fa-box stat-icon"></i>
            </div>
        </div>

        <div class="chart-container">
            <h3>Monthly Revenue</h3>
            <div style="height: 300px; display: flex; align-items: flex-end; gap: 20px; padding: 20px;">
                ${mockData.monthlyRevenue.map(data => `
                    <div style="flex: 1; text-align: center;">
                        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                                    height: ${(data.revenue / 250)}px; 
                                    border-radius: 8px 8px 0 0;
                                    margin-bottom: 10px;
                                    transition: all 0.3s;
                                    cursor: pointer;"
                             onmouseover="this.style.transform='translateY(-10px)'"
                             onmouseout="this.style.transform='translateY(0)'"
                             title="$${data.revenue}"></div>
                        <strong>${data.month}</strong>
                        <div style="font-size: 0.85rem; color: #6b7280;">${data.orders} orders</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="table-container">
            <div class="table-header">
                <h3>Recent Orders</h3>
                <a href="#" onclick="loadPage('orders')" class="btn btn-primary btn-sm">
                    View All
                </a>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Products</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.orders.slice(0, 5).map(order => `
                        <tr>
                            <td><strong>${order.id}</strong></td>
                            <td>${order.customer}</td>
                            <td>${order.products.join(', ')}</td>
                            <td>$${order.total.toFixed(2)}</td>
                            <td><span class="badge-status ${order.status}">${order.status}</span></td>
                            <td>${order.date}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}
