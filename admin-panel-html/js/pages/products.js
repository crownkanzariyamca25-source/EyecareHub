// Products Page
function renderProducts() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h3>Products Management</h3>
                <div class="table-actions">
                    <div class="search-bar">
                        <input type="text" id="productSearch" placeholder="Search products..." oninput="searchProducts(this.value)">
                        <i class="fas fa-search"></i>
                    </div>
                    <button class="btn btn-primary" onclick="showAddProductModal()">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="productsTableBody">
                    ${mockData.products.map(product => `
                        <tr>
                            <td>
                                <div style="display: flex; align-items: center; gap: 10px;">
                                    <span style="font-size: 2rem;">${product.image}</span>
                                    <div>
                                        <strong>${product.name}</strong>
                                        <div style="font-size: 0.85rem; color: #6b7280;">${product.description}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${product.category}</td>
                            <td>₹${product.price.toFixed(2)}</td>
                            <td><span class="badge-status ${product.stock > 30 ? 'active' : 'pending'}">${product.stock} units</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="action-btn edit" onclick="editProduct('${product.id}')">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <!-- Product Modal -->
        <div id="productModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="modalTitle">Add Product</h3>
                    <button class="modal-close" onclick="closeProductModal()">&times;</button>
                </div>
                <form id="productForm" onsubmit="saveProduct(event)">
                    <input type="hidden" id="productId">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Product Name *</label>
                            <input type="text" id="productName" required>
                        </div>
                        <div class="form-group">
                            <label>Category *</label>
                            <select id="productCategory" required>
                                <option value="">Select Category</option>
                                <option value="Eyeglasses">Eyeglasses</option>
                                <option value="Sunglasses">Sunglasses</option>
                                <option value="Contact Lenses">Contact Lenses</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Price ($) *</label>
                            <input type="number" id="productPrice" step="0.01" min="0" required>
                        </div>
                        <div class="form-group">
                            <label>Stock *</label>
                            <input type="number" id="productStock" min="0" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Icon/Emoji</label>
                            <input type="text" id="productImage" placeholder="👓 🕶️ 👁️" maxlength="2">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea id="productDescription" rows="3"></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeProductModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Product Modal -->
        <div id="deleteProductModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; margin: -25px -25px 20px; padding: 25px; border-radius: 12px 12px 0 0;">
                    <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                        Delete Product
                    </h3>
                    <button class="modal-close" onclick="closeDeleteProductModal()" style="color: white; opacity: 0.9;">&times;</button>
                </div>
                <div id="deleteProductContent" style="padding: 10px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="width: 80px; height: 80px; background: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <i class="fas fa-trash-alt" style="font-size: 2rem; color: #ef4444;"></i>
                        </div>
                        <h4 style="margin: 0 0 10px 0; color: #111827;">Are you sure?</h4>
                        <p style="color: #6b7280; margin: 0; font-size: 0.95rem;">
                            This action cannot be undone. This will permanently delete the product.
                        </p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Product Name:</span>
                            <strong id="deleteProductName" style="color: #111827;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Category:</span>
                            <strong id="deleteProductCategory" style="color: #111827;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280; font-weight: 500;">Price:</span>
                            <strong id="deleteProductPrice" style="color: #111827;"></strong>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="gap: 10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeDeleteProductModal()" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-danger" onclick="confirmDeleteProduct()" style="flex: 1;">
                        <i class="fas fa-trash"></i> Delete Product
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Add Product';
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('productModal').classList.add('show');
}

function editProduct(id) {
    const product = mockData.products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category;
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productImage').value = product.image;
    document.getElementById('productDescription').value = product.description;
    
    document.getElementById('productModal').classList.add('show');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('show');
    document.getElementById('productForm').reset();
}

function saveProduct(event) {
    event.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        image: document.getElementById('productImage').value || '📦',
        description: document.getElementById('productDescription').value
    };

    if (productId) {
        // Edit existing product
        const index = mockData.products.findIndex(p => p.id === productId);
        if (index !== -1) {
            mockData.products[index] = { ...mockData.products[index], ...productData };
            showNotification('Product updated successfully!');
        }
    } else {
        // Add new product
        const newProduct = {
            id: (mockData.products.length + 1).toString(),
            ...productData
        };
        mockData.products.push(newProduct);
        showNotification('Product added successfully!');
    }

    closeProductModal();
    loadPage('products'); // Refresh the page
}

let deleteProductId = null;

function deleteProduct(id) {
    const product = mockData.products.find(p => p.id === id);
    if (!product) return;

    deleteProductId = id;
    
    // Populate modal with product details
    document.getElementById('deleteProductName').textContent = product.name;
    document.getElementById('deleteProductCategory').textContent = product.category;
    document.getElementById('deleteProductPrice').textContent = '$' + product.price.toFixed(2);
    
    document.getElementById('deleteProductModal').classList.add('show');
}

function closeDeleteProductModal() {
    document.getElementById('deleteProductModal').classList.remove('show');
    deleteProductId = null;
}

function confirmDeleteProduct() {
    if (!deleteProductId) return;
    
    const index = mockData.products.findIndex(p => p.id === deleteProductId);
    if (index !== -1) {
        const productName = mockData.products[index].name;
        mockData.products.splice(index, 1);
        closeDeleteProductModal();
        showNotification(`Product "${productName}" deleted successfully!`);
        loadPage('products'); // Refresh the page
    }
}

function searchProducts(query) {
    const tbody = document.getElementById('productsTableBody');
    if (!tbody) return;

    const filtered = mockData.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
    );

    tbody.innerHTML = filtered.map(product => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 2rem;">${product.image}</span>
                    <div>
                        <strong>${product.name}</strong>
                        <div style="font-size: 0.85rem; color: #6b7280;">${product.description}</div>
                    </div>
                </div>
            </td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td><span class="badge-status ${product.stock > 30 ? 'active' : 'pending'}">${product.stock} units</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editProduct('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
