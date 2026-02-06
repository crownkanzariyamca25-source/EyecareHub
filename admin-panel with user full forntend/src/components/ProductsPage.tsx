import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plus, Search, Edit2, Trash2, X, Package, AlertCircle, Check } from 'lucide-react';
import { Product } from '../types';
import { mockProducts, ALLOWED_CATEGORIES } from '../data/mockData';

// Icons for each category
const categoryIcons: Record<string, string> = {
  'Eyeglasses': '👓',
  'Sunglasses': '🕶️',
  'Contact Lenses': '👁️'
};

interface FormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  image: string;
}

const initialFormData: FormData = {
  name: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  image: '👓'
};

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.product-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [products, categoryFilter, searchTerm]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [showModal]);

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm);
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      description: product.description,
      image: product.image
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      errors.name = 'Product name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Product name must be less than 100 characters';
    }

    // Check for duplicate names (excluding current product if editing)
    const duplicateName = products.find(
      p => p.name.toLowerCase() === formData.name.trim().toLowerCase() && 
           p.id !== editingProduct?.id
    );
    if (duplicateName) {
      errors.name = 'A product with this name already exists';
    }

    // Validate category
    if (!formData.category) {
      errors.category = 'Please select a category';
    } else if (!ALLOWED_CATEGORIES.includes(formData.category as typeof ALLOWED_CATEGORIES[number])) {
      errors.category = 'Invalid category selected';
    }

    // Validate price
    const price = parseFloat(formData.price);
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(price) || price <= 0) {
      errors.price = 'Price must be a positive number';
    } else if (price > 99999.99) {
      errors.price = 'Price cannot exceed $99,999.99';
    }

    // Validate stock
    const stock = parseInt(formData.stock);
    if (!formData.stock) {
      errors.stock = 'Stock is required';
    } else if (isNaN(stock) || stock < 0) {
      errors.stock = 'Stock must be 0 or greater';
    } else if (stock > 99999) {
      errors.stock = 'Stock cannot exceed 99,999';
    } else if (!Number.isInteger(stock)) {
      errors.stock = 'Stock must be a whole number';
    }

    // Validate description (optional but if provided, check length)
    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const productImage = categoryIcons[formData.category] || '📦';

    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { 
              ...p, 
              name: formData.name.trim(),
              category: formData.category,
              price: parseFloat(formData.price), 
              stock: parseInt(formData.stock),
              description: formData.description.trim(),
              image: productImage
            }
          : p
      ));
      setToast({ type: 'success', message: `Product "${formData.name.trim()}" updated successfully` });
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description.trim(),
        image: productImage
      };
      setProducts([...products, newProduct]);
      setToast({ type: 'success', message: `Product "${formData.name.trim()}" added successfully` });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    // First click - show confirmation
    if (deleteConfirm !== id) {
      setToast({ type: 'error', message: `Click delete again to confirm removing "${product.name}"` });
      setDeleteConfirm(id);
      // Auto-cancel delete confirmation after 4 seconds
      setTimeout(() => setDeleteConfirm(null), 4000);
      return;
    }

    // Second click - actually delete
    gsap.to(`[data-product-id="${id}"]`, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setProducts(products.filter(p => p.id !== id));
        setDeleteConfirm(null);
        setToast({ type: 'success', message: `Product "${product.name}" deleted successfully` });
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setFormData({ 
      ...formData, 
      category,
      image: categoryIcons[category] || '📦'
    });
    // Clear category error when user selects
    if (formErrors.category) {
      setFormErrors({ ...formErrors, category: undefined });
    }
  };

  // Count products per category
  const categoryCount = ALLOWED_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category === cat).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div ref={containerRef} className="p-4 lg:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-[100] px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {toast.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500">Manage your optical product inventory ({products.length} products)</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, category, description or price..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Category filter chips */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              categoryFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ({products.length})
          </button>
          {ALLOWED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                categoryFilter === cat ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span>{categoryIcons[cat]}</span>
              {cat} ({categoryCount[cat]})
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            data-product-id={product.id}
            className="product-card bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center text-3xl">
                {product.image}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(product)}
                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  title="Edit product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    deleteConfirm === product.id 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={deleteConfirm === product.id ? 'Click again to confirm' : 'Delete product'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
              <span>{categoryIcons[product.category]}</span>
              {product.category}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-violet-600">${product.price.toFixed(2)}</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                product.stock > 50 ? 'bg-emerald-100 text-emerald-700' :
                product.stock > 20 ? 'bg-amber-100 text-amber-700' :
                product.stock > 0 ? 'bg-orange-100 text-orange-700' :
                'bg-red-100 text-red-700'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter' 
              : 'Add your first product to get started'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    formErrors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Enter product name"
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {ALLOWED_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`p-3 rounded-xl border-2 transition-all text-center ${
                        formData.category === cat
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      <span className="text-2xl block mb-1">{categoryIcons[cat]}</span>
                      <span className="text-xs font-medium text-gray-700">{cat}</span>
                    </button>
                  ))}
                </div>
                {formErrors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.category}
                  </p>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="99999.99"
                    value={formData.price}
                    onChange={(e) => {
                      setFormData({ ...formData, price: e.target.value });
                      if (formErrors.price) setFormErrors({ ...formErrors, price: undefined });
                    }}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.price ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.price && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99999"
                    value={formData.stock}
                    onChange={(e) => {
                      setFormData({ ...formData, stock: e.target.value });
                      if (formErrors.stock) setFormErrors({ ...formErrors, stock: undefined });
                    }}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.stock ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="0"
                  />
                  {formErrors.stock && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    if (formErrors.description) setFormErrors({ ...formErrors, description: undefined });
                  }}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none ${
                    formErrors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  rows={3}
                  placeholder="Enter product description (optional)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.description.length}/500 characters
                </p>
                {formErrors.description && (
                  <p className="text-red-500 text-xs">{formErrors.description}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
                >
                  {editingProduct ? 'Update' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
