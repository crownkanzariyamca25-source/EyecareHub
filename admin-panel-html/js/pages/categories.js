// Categories Page
function renderCategories() {
    return `
        <div class="table-container">
            <div class="table-header">
                <h3>Categories Management</h3>
                <button class="btn btn-primary" onclick="showAddCategoryModal()">
                    <i class="fas fa-plus"></i> Add Category
                </button>
            </div>
            <div id="categoriesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px;">
                ${mockData.categories.map(category => `
                    <div style="background: white; padding: 25px; border-radius: 12px; border: 2px solid #e5e7eb; transition: all 0.3s;"
                         onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-5px)'"
                         onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'">
                        <div style="font-size: 3rem; text-align: center; margin-bottom: 15px;">
                            ${category.icon}
                        </div>
                        <h3 style="text-align: center; margin-bottom: 10px;">${category.name}</h3>
                        <p style="color: #6b7280; text-align: center; margin-bottom: 15px; font-size: 0.9rem;">
                            ${category.description}
                        </p>
                        <div style="text-align: center; margin-bottom: 15px;">
                            <span class="badge-status active">${category.productCount} Products</span>
                        </div>
                        <div class="action-buttons" style="justify-content: center;">
                            <button class="btn btn-primary btn-sm" onclick="editCategory('${category.id}')">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category.id}')">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Category Modal -->
        <div id="categoryModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="categoryModalTitle">Add Category</h3>
                    <button class="modal-close" onclick="closeCategoryModal()">&times;</button>
                </div>
                <form id="categoryForm" onsubmit="saveCategory(event)">
                    <input type="hidden" id="categoryId">
                    <div class="form-group">
                        <label>Category Name *</label>
                        <input type="text" id="categoryName" required placeholder="e.g., Eyeglasses, Sunglasses">
                    </div>
                    <div class="form-group">
                        <label>Icon/Emoji *</label>
                        <input type="text" id="categoryIcon" required placeholder="👓 🕶️ 👁️" maxlength="2">
                        <small style="color: #6b7280; font-size: 0.85rem; margin-top: 5px; display: block;">
                            Choose an emoji to represent this category
                        </small>
                    </div>
                    <div class="form-group">
                        <label>Description *</label>
                        <textarea id="categoryDescription" rows="4" required placeholder="Brief description of the category..."></textarea>
                    </div>
                    <div class="form-group">
                        <label>Product Count</label>
                        <input type="number" id="categoryProductCount" min="0" value="0" placeholder="Number of products">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="closeCategoryModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Category
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Delete Category Modal -->
        <div id="deleteCategoryModal" class="modal">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; margin: -25px -25px 20px; padding: 25px; border-radius: 12px 12px 0 0;">
                    <h3 style="margin: 0; color: white; display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 1.5rem;"></i>
                        Delete Category
                    </h3>
                    <button class="modal-close" onclick="closeDeleteCategoryModal()" style="color: white; opacity: 0.9;">&times;</button>
                </div>
                <div id="deleteCategoryContent" style="padding: 10px 0;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="width: 80px; height: 80px; background: #fee2e2; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                            <i class="fas fa-trash-alt" style="font-size: 2rem; color: #ef4444;"></i>
                        </div>
                        <h4 style="margin: 0 0 10px 0; color: #111827;">Are you sure?</h4>
                        <p style="color: #6b7280; margin: 0; font-size: 0.95rem;">
                            This action cannot be undone. This will permanently delete the category.
                        </p>
                    </div>
                    
                    <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Category Name:</span>
                            <strong id="deleteCategoryName" style="color: #111827;"></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span style="color: #6b7280; font-weight: 500;">Icon:</span>
                            <span id="deleteCategoryIcon" style="font-size: 1.5rem;"></span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span style="color: #6b7280; font-weight: 500;">Products:</span>
                            <strong id="deleteCategoryProducts" style="color: #111827;"></strong>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="gap: 10px;">
                    <button type="button" class="btn btn-secondary" onclick="closeDeleteCategoryModal()" style="flex: 1;">
                        <i class="fas fa-times"></i> Cancel
                    </button>
                    <button type="button" class="btn btn-danger" onclick="confirmDeleteCategory()" style="flex: 1;">
                        <i class="fas fa-trash"></i> Delete Category
                    </button>
                </div>
            </div>
        </div>
    `;
}

function showAddCategoryModal() {
    document.getElementById('categoryModalTitle').textContent = 'Add Category';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryProductCount').value = '0';
    document.getElementById('categoryModal').classList.add('show');
}

function editCategory(id) {
    const category = mockData.categories.find(c => c.id === id);
    if (!category) return;

    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryIcon').value = category.icon;
    document.getElementById('categoryDescription').value = category.description;
    document.getElementById('categoryProductCount').value = category.productCount;
    
    document.getElementById('categoryModal').classList.add('show');
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('show');
    document.getElementById('categoryForm').reset();
}

function saveCategory(event) {
    event.preventDefault();
    
    const categoryId = document.getElementById('categoryId').value;
    const categoryData = {
        name: document.getElementById('categoryName').value,
        icon: document.getElementById('categoryIcon').value,
        description: document.getElementById('categoryDescription').value,
        productCount: parseInt(document.getElementById('categoryProductCount').value) || 0
    };

    if (categoryId) {
        // Edit existing category
        const index = mockData.categories.findIndex(c => c.id === categoryId);
        if (index !== -1) {
            mockData.categories[index] = { ...mockData.categories[index], ...categoryData };
            showCategoryNotification('Category updated successfully!', 'success');
        }
    } else {
        // Add new category
        const newCategory = {
            id: (mockData.categories.length + 1).toString(),
            ...categoryData
        };
        mockData.categories.push(newCategory);
        showCategoryNotification('Category added successfully!', 'success');
    }

    closeCategoryModal();
    loadPage('categories'); // Refresh the page
}

let deleteCategoryId = null;

function deleteCategory(id) {
    const category = mockData.categories.find(c => c.id === id);
    if (!category) return;

    deleteCategoryId = id;
    
    // Populate modal with category details
    document.getElementById('deleteCategoryName').textContent = category.name;
    document.getElementById('deleteCategoryIcon').textContent = category.icon;
    document.getElementById('deleteCategoryProducts').textContent = category.productCount;
    
    document.getElementById('deleteCategoryModal').classList.add('show');
}

function closeDeleteCategoryModal() {
    document.getElementById('deleteCategoryModal').classList.remove('show');
    deleteCategoryId = null;
}

function confirmDeleteCategory() {
    if (!deleteCategoryId) return;
    
    const index = mockData.categories.findIndex(c => c.id === deleteCategoryId);
    if (index !== -1) {
        const categoryName = mockData.categories[index].name;
        mockData.categories.splice(index, 1);
        closeDeleteCategoryModal();
        showCategoryNotification(`Category "${categoryName}" deleted successfully!`, 'success');
        loadPage('categories'); // Refresh the page
    }
}

function showCategoryNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
    
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
    `;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    notification.innerHTML = `<strong>${icon}</strong> ${message}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}
