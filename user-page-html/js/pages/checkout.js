// Checkout Page
function renderCheckout() {
    if (cart.length === 0) {
        return `
            <section class="section">
                <div class="container">
                    <div style="text-align: center; padding: 100px 20px;">
                        <i class="fas fa-shopping-cart" style="font-size: 4rem; color: var(--gray); margin-bottom: 20px;"></i>
                        <h2>Your cart is empty</h2>
                        <p style="color: var(--gray); margin: 20px 0;">Add some products to proceed to checkout</p>
                        <button class="btn btn-primary btn-lg" onclick="loadPage('products')">
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </section>
        `;
    }
    
    const subtotal = getCartTotal();
    const shipping = 5.99;
    const tax = (subtotal * 0.08).toFixed(2);
    const total = (parseFloat(subtotal) + shipping + parseFloat(tax)).toFixed(2);
    
    return `
        <section class="section">
            <div class="container">
                <h2 style="margin-bottom: 30px;">Checkout</h2>
                <div class="checkout-grid">
                    <div class="checkout-form">
                        <form id="checkoutForm" onsubmit="handleCheckout(event)">
                            <div class="form-section">
                                <h3>Contact Information</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Email Address *</label>
                                        <input type="email" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number *</label>
                                        <input type="tel" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Shipping Address</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>First Name *</label>
                                        <input type="text" required>
                                    </div>
                                    <div class="form-group">
                                        <label>Last Name *</label>
                                        <input type="text" required>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label>Street Address *</label>
                                    <input type="text" required>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>City *</label>
                                        <input type="text" required>
                                    </div>
                                    <div class="form-group">
                                        <label>State/Province *</label>
                                        <input type="text" required>
                                    </div>
                                    <div class="form-group">
                                        <label>ZIP/Postal Code *</label>
                                        <input type="text" required>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-section">
                                <h3>Payment Method</h3>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Card Number *</label>
                                        <input type="text" required placeholder="1234 5678 9012 3456">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group">
                                        <label>Expiry Date *</label>
                                        <input type="text" required placeholder="MM/YY">
                                    </div>
                                    <div class="form-group">
                                        <label>CVV *</label>
                                        <input type="text" required placeholder="123">
                                    </div>
                                </div>
                            </div>
                            
                            <button type="submit" class="btn btn-primary btn-lg btn-block">
                                <i class="fas fa-lock"></i> Place Order - ₹${total}
                            </button>
                        </form>
                    </div>
                    
                    <div class="order-summary">
                        <h3 style="margin-bottom: 20px;">Order Summary</h3>
                        
                        <div style="margin-bottom: 20px;">
                            ${cart.map(item => `
                                <div class="summary-item" style="flex-direction: column; align-items: flex-start;">
                                    <div style="display: flex; justify-content: space-between; width: 100%;">
                                        <span><strong>${item.name}</strong></span>
                                        <span>₹${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                    <span style="color: var(--gray); font-size: 0.9rem;">Qty: ${item.quantity}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="summary-item">
                            <span>Subtotal</span>
                            <span>₹${subtotal}</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping</span>
                            <span>₹${shipping.toFixed(2)}</span>
                        </div>
                        <div class="summary-item">
                            <span>Tax</span>
                            <span>₹${tax}</span>
                        </div>
                        <div class="summary-item summary-total">
                            <span>Total</span>
                            <span>₹${total}</span>
                        </div>
                        
                        <div style="margin-top: 20px; padding: 15px; background: var(--light-bg); border-radius: 8px; font-size: 0.9rem; color: var(--gray);">
                            <i class="fas fa-shield-alt" style="color: var(--success);"></i>
                            Your payment information is secure and encrypted
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function handleCheckout(event) {
    event.preventDefault();
    
    // Save order
    const order = {
        id: 'ORD-' + Date.now(),
        items: cart,
        total: getCartTotal(),
        date: new Date().toLocaleDateString(),
        status: 'processing'
    };
    
    let orders = JSON.parse(localStorage.getItem('eyecare_orders')) || [];
    orders.push(order);
    localStorage.setItem('eyecare_orders', JSON.stringify(orders));
    
    // Clear cart
    clearCart();
    
    // Show success and redirect
    showNotification('Order placed successfully!');
    setTimeout(() => {
        window.currentOrderId = order.id;
        loadPage('order-success');
    }, 1000);
}
