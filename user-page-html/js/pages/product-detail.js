// Product Detail Page
function renderProductDetail() {
    const productId = window.currentProductId;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        return '<div class="container" style="padding: 100px 20px; text-align: center;"><h2>Product not found</h2></div>';
    }
    
    const finalPrice = getFinalPrice(product);
    
    return `
        <section class="section">
            <div class="container">
                <div class="product-detail-grid">
                    <div class="product-gallery">
                        <img src="${product.images[0]}" alt="${product.name}" class="main-image" id="mainImage">
                    </div>
                    
                    <div class="product-details">
                        <div class="product-meta">
                            <span class="product-category">${product.category}</span>
                            <span style="color: var(--gray);">|</span>
                            <span style="color: var(--gray);">Brand: ${product.brand}</span>
                        </div>
                        
                        <h1 class="product-title">${product.name}</h1>
                        
                        <div class="product-rating">
                            <span class="stars">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}</span>
                            <span class="reviews">${product.rating} (${product.reviews} reviews)</span>
                        </div>
                        
                        <div class="product-price" style="margin: 30px 0;">
                            <span class="current-price" style="font-size: 2.5rem;">₹${finalPrice}</span>
                            ${product.discount > 0 ? `
                                <span class="original-price" style="font-size: 1.5rem;">₹${product.price.toFixed(2)}</span>
                                <span class="product-badge" style="position: static; margin-left: 10px;">Save ${product.discount}%</span>
                            ` : ''}
                        </div>
                        
                        <p style="color: var(--gray); font-size: 1.1rem; margin: 20px 0;">
                            ${product.description}
                        </p>
                        
                        <div style="background: var(--light-bg); padding: 20px; border-radius: 12px; margin: 20px 0;">
                            <h4 style="margin-bottom: 15px;">Product Details</h4>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                                <div>
                                    <strong>Frame Type:</strong><br>
                                    <span style="color: var(--gray);">${product.frameType}</span>
                                </div>
                                <div>
                                    <strong>Lens Type:</strong><br>
                                    <span style="color: var(--gray);">${product.lensType}</span>
                                </div>
                            </div>
                        </div>
                        
                        <h4 style="margin: 25px 0 15px 0;">Key Features</h4>
                        <ul class="features-list">
                            ${product.features.map(feature => `
                                <li>
                                    <i class="fas fa-check-circle"></i>
                                    <span>${feature}</span>
                                </li>
                            `).join('')}
                        </ul>
                        
                        <div class="quantity-selector">
                            <label style="font-weight: 600;">Quantity:</label>
                            <div class="quantity-controls">
                                <button class="qty-btn-large" onclick="decrementQty()">-</button>
                                <span class="qty-value" id="qtyValue">1</span>
                                <button class="qty-btn-large" onclick="incrementQty()">+</button>
                            </div>
                        </div>
                        
                        <div style="display: flex; gap: 15px; margin-top: 30px;">
                            <button class="btn btn-primary btn-lg" style="flex: 1;" onclick="addToCartFromDetail()">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                            <button class="btn btn-outline btn-lg" onclick="buyNow()">
                                <i class="fas fa-bolt"></i> Buy Now
                            </button>
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid var(--border); display: flex; gap: 20px;">
                            <div style="flex: 1; text-align: center; padding: 15px;">
                                <i class="fas fa-shipping-fast" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
                                <div style="font-size: 0.9rem;">Free Shipping</div>
                            </div>
                            <div style="flex: 1; text-align: center; padding: 15px;">
                                <i class="fas fa-shield-alt" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
                                <div style="font-size: 0.9rem;">2 Year Warranty</div>
                            </div>
                            <div style="flex: 1; text-align: center; padding: 15px;">
                                <i class="fas fa-undo" style="font-size: 2rem; color: var(--primary); margin-bottom: 10px;"></i>
                                <div style="font-size: 0.9rem;">30 Day Returns</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

let quantity = 1;

function incrementQty() {
    quantity++;
    document.getElementById('qtyValue').textContent = quantity;
}

function decrementQty() {
    if (quantity > 1) {
        quantity--;
        document.getElementById('qtyValue').textContent = quantity;
    }
}

function addToCartFromDetail() {
    addToCart(window.currentProductId, quantity);
    quantity = 1;
    document.getElementById('qtyValue').textContent = quantity;
}

function buyNow() {
    addToCart(window.currentProductId, quantity);
    quantity = 1;
    loadPage('checkout');
}
