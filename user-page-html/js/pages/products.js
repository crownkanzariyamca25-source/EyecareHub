// Products Page
let currentCategory = window.currentCategory || 'all';
let currentSort = 'featured';

function renderProducts() {
    let filteredProducts = products;
    
    if (currentCategory && currentCategory !== 'all') {
        filteredProducts = products.filter(p => p.category === currentCategory);
    }
    
    // Sort products
    if (currentSort === 'price-low') {
        filteredProducts.sort((a, b) => getFinalPrice(a) - getFinalPrice(b));
    } else if (currentSort === 'price-high') {
        filteredProducts.sort((a, b) => getFinalPrice(b) - getFinalPrice(a));
    } else if (currentSort === 'rating') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }
    
    return `
        <section class="section">
            <div class="container">
                <div class="section-header">
                    <h2 class="section-title">Our Products</h2>
                    <p class="section-subtitle">Discover our complete eyewear collection</p>
                </div>
                
                <div class="filter-section">
                    <div class="filter-controls">
                        <div class="filter-group">
                            <label>Category</label>
                            <select id="categoryFilter" onchange="filterProducts(this.value)">
                                <option value="all">All Categories</option>
                                <option value="eyeglasses" ${currentCategory === 'eyeglasses' ? 'selected' : ''}>Eyeglasses</option>
                                <option value="sunglasses" ${currentCategory === 'sunglasses' ? 'selected' : ''}>Sunglasses</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Sort By</label>
                            <select id="sortFilter" onchange="sortProducts(this.value)">
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="rating">Highest Rated</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label>Search</label>
                            <input type="text" id="searchInput" placeholder="Search products..." oninput="searchProducts(this.value)">
                        </div>
                    </div>
                </div>
                
                <div class="product-grid" id="productGrid">
                    ${filteredProducts.map(product => createProductCard(product)).join('')}
                </div>
                
                ${filteredProducts.length === 0 ? '<div style="text-align: center; padding: 40px; color: var(--gray);"><i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i><p>No products found</p></div>' : ''}
            </div>
        </section>
    `;
}

function createProductCard(product) {
    const finalPrice = getFinalPrice(product);
    return `
        <div class="product-card" onclick="viewProduct('${product.id}')">
            <div style="position: relative;">
                <img src="${product.images[0]}" alt="${product.name}" class="product-image">
                ${product.discount > 0 ? `<div class="product-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <span class="stars">${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}</span>
                    <span class="reviews">(${product.reviews})</span>
                </div>
                <div class="product-price">
                    <span class="current-price">₹${finalPrice}</span>
                    ${product.discount > 0 ? `<span class="original-price">₹${product.price.toFixed(2)}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary btn-block" onclick="event.stopPropagation(); addToCart('${product.id}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function filterProducts(category) {
    currentCategory = category;
    loadPage('products');
}

function sortProducts(sort) {
    currentSort = sort;
    loadPage('products');
}

function searchProducts(query) {
    const productGrid = document.getElementById('productGrid');
    if (!productGrid) return;
    
    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
    );
    
    productGrid.innerHTML = filtered.map(product => createProductCard(product)).join('');
}

function viewProduct(id) {
    window.currentProductId = id;
    loadPage('product-detail');
}
