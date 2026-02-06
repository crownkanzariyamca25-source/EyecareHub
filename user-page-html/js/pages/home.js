// Home Page
function renderHome() {
    return `
        <section class="hero">
            <div class="container">
                <h1>See the World Clearly</h1>
                <p>Premium eyewear for every style and need</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button class="btn btn-primary btn-lg" onclick="loadPage('products')">
                        <i class="fas fa-shopping-bag"></i> Shop Now
                    </button>
                    <button class="btn btn-outline btn-lg" onclick="scrollToSection('categories')">
                        <i class="fas fa-th-large"></i> Browse Categories
                    </button>
                </div>
                <div class="hero-features">
                    <div class="hero-feature">
                        <i class="fas fa-shipping-fast"></i>
                        <span>Free Shipping</span>
                    </div>
                    <div class="hero-feature">
                        <i class="fas fa-shield-alt"></i>
                        <span>2 Year Warranty</span>
                    </div>
                    <div class="hero-feature">
                        <i class="fas fa-undo"></i>
                        <span>30 Day Returns</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="section" id="categories">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Shop by Category</h2>
                    <p class="section-subtitle">Find the perfect eyewear for your needs</p>
                </div>
                <div class="category-grid">
                    ${categories.map(category => `
                        <div class="category-card" onclick="filterByCategory('${category.id}')">
                            <div class="category-icon">${category.icon}</div>
                            <h3 class="category-name">${category.name}</h3>
                            <p class="category-desc">${category.description}</p>
                            <button class="btn btn-outline" style="margin-top: 15px;">
                                Explore ${category.name}
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </section>

        <section class="section" style="background: var(--light-bg);">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Featured Products</h2>
                    <p class="section-subtitle">Handpicked bestsellers</p>
                </div>
                <div class="product-grid">
                    ${products.slice(0, 4).map(product => createProductCard(product)).join('')}
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <button class="btn btn-primary btn-lg" onclick="loadPage('products')">
                        View All Products
                    </button>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Why Choose EyeCareHub?</h2>
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px;">
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-award" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <h3>Premium Quality</h3>
                        <p style="color: var(--gray);">Only the finest materials and craftsmanship</p>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-certificate" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <h3>Certified Brands</h3>
                        <p style="color: var(--gray);">Authentic products from trusted manufacturers</p>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-headset" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <h3>Expert Support</h3>
                        <p style="color: var(--gray);">Dedicated customer service team</p>
                    </div>
                    <div style="text-align: center; padding: 30px;">
                        <i class="fas fa-lock" style="font-size: 3rem; color: var(--primary); margin-bottom: 15px;"></i>
                        <h3>Secure Checkout</h3>
                        <p style="color: var(--gray);">Safe and encrypted transactions</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function filterByCategory(categoryId) {
    window.currentCategory = categoryId;
    loadPage('products');
}

function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}
