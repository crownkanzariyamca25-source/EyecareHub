// Coupons Page
function renderCoupons() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h3>Coupons & Discounts</h3>
                <button class="btn btn-primary" onclick="showAddCouponModal()">
                    <i class="fas fa-plus"></i> Add Coupon
                </button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Discount</th>
                        <th>Type</th>
                        <th>Min Order</th>
                        <th>Usage</th>
                        <th>Expiry Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${mockData.coupons.map(coupon => `
                        <tr>
                            <td><strong>${coupon.code}</strong></td>
                            <td>
                                ${coupon.type === 'percentage' ? coupon.discount + '%' : '₹' + coupon.discount}
                            </td>
                            <td>
                                <span class="badge-status ${coupon.type === 'percentage' ? 'active' : 'shipped'}">
                                    ${coupon.type}
                                </span>
                            </td>
                            <td>₹${coupon.minOrder}</td>
                            <td>
                                <div style="font-size: 0.9rem;">
                                    ${coupon.usageCount} / ${coupon.usageLimit}
                                </div>
                                <div style="background: #e5e7eb; height: 6px; border-radius: 3px; margin-top: 5px;">
                                    <div style="background: #3b82f6; height: 100%; width: ${(coupon.usageCount / coupon.usageLimit) * 100}%; border-radius: 3px;"></div>
                                </div>
                            </td>
                            <td>${coupon.expiryDate}</td>
                            <td><span class="badge-status ${coupon.status}">${coupon.status}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" onclick="editCoupon('${coupon.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" onclick="deleteCoupon('${coupon.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Coupon Modal -->
        <div id="couponModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="couponModalTitle">Add Coupon</h3>
                    <button class="modal-close" onclick="closeCouponModal()">&times;</button>
                </div>
                <form id="couponForm" onsubmit="saveCoupon(event)">
                    <input type="hidden" id="couponId">
                    <div class="form-group">
                        <label>Coupon Code *</label>
                        <input type="text" id="couponCode" required placeholder="e.g., SUMMER2024" style="text-transform: uppercase;">
                        <small style="color: #6b7280; font-size: 0.85rem; margin-top: 5px; display: block;">
                            Unique code customers will use at checkout
                        </small>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Discount Type *</label>
                            <select id="couponType" required onchange="updateDiscountLabel()">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label id="discountLabel">Discount (%) *</label>
                            <input type="number" id="couponDiscount" required min="1" placeholder="10">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div class="form-group">
                            <label>Minimum Order (₹) *</label>
                            <input type="number" id="couponMinOrder" required min="0" placeholder="50">
                        </div>
                        <div class="form-group">
                            <label>Usage Limit *</label>
                            <input type="number" id="couponUsageLimit" required min="1" placeholder="100">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Expiry Date *</label>
                        <input type="date" id="couponExpiryDate" required>
                    </div>
                    <div class="form-group">
                        <label>Status *</label>
                        <select id="couponStatus" required>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeCouponModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Coupon
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div id="deleteCouponModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; margin: -25px -25px 20px; padding: 25px; border-radius: 12px 12px 0 0;">
                    <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                        Delete Coupon
                    </h3>
                    <button class="modal-close" onclick="closeDeleteCouponModal()" style="color: white; opacity: 0.9;">&times;</button>
                </div>
                <div id="deleteCouponContent" style="padding: 10px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="width: 80px; height: 80px; background: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <i class="fas fa-trash-alt" style="font-size: 2rem; color: #ef4444;"></i>
                        </div>
                        <h4 style="margin: 0 0 10px 0; color: #111827;">Are you sure?</h4>
                        <p style="color: #6b7280; margin: 0; font-size: 0.95rem;">
                            This action cannot be undone. This will permanently delete the coupon.
                        </p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Coupon Code:</span>
                            <strong id="deleteCouponCode" style="color: #111827;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Discount:</span>
                            <strong id="deleteCouponDiscount" style="color: #111827;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280; font-weight: 500;">Min Order:</span>
                            <strong style="color: #111827;">₹<span id="deleteCouponMinOrder"></span></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280; font-weight: 500;">Usage:</span>
                            <strong id="deleteCouponUsage" style="color: #111827;"></strong>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="gap: 10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeDeleteCouponModal()" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-danger" onclick="confirmDeleteCoupon()" style="flex: 1;">
                        <i class="fas fa-trash"></i> Delete Coupon
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateDiscountLabel() {
    const type = document.getElementById('couponType').value;
    const label = document.getElementById('discountLabel');
    label.textContent = type === 'percentage' ? 'Discount (%) *' : 'Discount (₹) *';
}

function showAddCouponModal() {
    document.getElementById('couponModalTitle').textContent = 'Add Coupon';
    document.getElementById('couponForm').reset();
    document.getElementById('couponId').value = '';
    document.getElementById('couponStatus').value = 'active';
    document.getElementById('couponType').value = 'percentage';
    updateDiscountLabel();
    
    // Set default expiry date to 30 days from now
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    document.getElementById('couponExpiryDate').value = defaultDate.toISOString().split('T')[0];
    
    document.getElementById('couponModal').classList.add('show');
}

function editCoupon(id) {
    const coupon = mockData.coupons.find(c => c.id === id);
    if (!coupon) return;

    document.getElementById('couponModalTitle').textContent = 'Edit Coupon';
    document.getElementById('couponId').value = coupon.id;
    document.getElementById('couponCode').value = coupon.code;
    document.getElementById('couponType').value = coupon.type;
    document.getElementById('couponDiscount').value = coupon.discount;
    document.getElementById('couponMinOrder').value = coupon.minOrder;
    document.getElementById('couponUsageLimit').value = coupon.usageLimit;
    document.getElementById('couponStatus').value = coupon.status;
    
    // Parse the date from the format "Dec 31, 2024" to "2024-12-31"
    const dateStr = coupon.expiryDate;
    const parsedDate = new Date(dateStr);
    document.getElementById('couponExpiryDate').value = parsedDate.toISOString().split('T')[0];
    
    updateDiscountLabel();
    document.getElementById('couponModal').classList.add('show');
}

function closeCouponModal() {
    document.getElementById('couponModal').classList.remove('show');
    document.getElementById('couponForm').reset();
}

function saveCoupon(event) {
    event.preventDefault();
    
    const couponId = document.getElementById('couponId').value;
    const code = document.getElementById('couponCode').value.toUpperCase();
    const type = document.getElementById('couponType').value;
    const discount = parseFloat(document.getElementById('couponDiscount').value);
    const minOrder = parseFloat(document.getElementById('couponMinOrder').value);
    const usageLimit = parseInt(document.getElementById('couponUsageLimit').value);
    const status = document.getElementById('couponStatus').value;
    const expiryDate = document.getElementById('couponExpiryDate').value;
    
    // Format the date to "Dec 31, 2024" format
    const formattedDate = new Date(expiryDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });

    const couponData = {
        code,
        discount,
        type,
        minOrder,
        usageLimit,
        expiryDate: formattedDate,
        status
    };

    if (couponId) {
        // Edit existing coupon
        const index = mockData.coupons.findIndex(c => c.id === couponId);
        if (index !== -1) {
            mockData.coupons[index] = { 
                ...mockData.coupons[index], 
                ...couponData 
            };
            showCouponNotification('Coupon updated successfully!', 'success');
        }
    } else {
        // Add new coupon
        const newCoupon = {
            id: (mockData.coupons.length + 1).toString(),
            usageCount: 0,
            ...couponData
        };
        mockData.coupons.push(newCoupon);
        showCouponNotification('Coupon added successfully!', 'success');
    }

    closeCouponModal();
    loadPage('coupons'); // Refresh the page
}

let deleteCouponId = null;

function deleteCoupon(id) {
    const coupon = mockData.coupons.find(c => c.id === id);
    if (!coupon) return;

    deleteCouponId = id;
    
    // Populate modal with coupon details
    document.getElementById('deleteCouponCode').textContent = coupon.code;
    document.getElementById('deleteCouponDiscount').textContent = 
        coupon.type === 'percentage' ? `${coupon.discount}%` : `₹${coupon.discount}`;
    document.getElementById('deleteCouponMinOrder').textContent = coupon.minOrder;
    document.getElementById('deleteCouponUsage').textContent = 
        `${coupon.usageCount} / ${coupon.usageLimit} used`;
    
    document.getElementById('deleteCouponModal').classList.add('show');
}

function closeDeleteCouponModal() {
    document.getElementById('deleteCouponModal').classList.remove('show');
    deleteCouponId = null;
}

function confirmDeleteCoupon() {
    if (!deleteCouponId) return;
    
    const index = mockData.coupons.findIndex(c => c.id === deleteCouponId);
    if (index !== -1) {
        const couponCode = mockData.coupons[index].code;
        mockData.coupons.splice(index, 1);
        closeDeleteCouponModal();
        showCouponNotification(`Coupon "${couponCode}" deleted successfully!`, 'success');
        loadPage('coupons'); // Refresh the page
    }
}

function showCouponNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    
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
        font-weight: 500;
    `;
    
    notification.innerHTML = `<strong style="font-size: 1.2rem;">${icon}</strong> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}
