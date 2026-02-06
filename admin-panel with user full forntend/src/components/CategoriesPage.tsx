import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Edit2, X, FolderTree, AlertCircle, Eye } from 'lucide-react';
import { Category } from '../types';
import { mockCategories, ALLOWED_CATEGORIES } from '../data/mockData';

// Fixed icons for each category
const categoryIcons: Record<string, string> = {
  'Eyeglasses': '👓',
  'Sunglasses': '🕶️',
  'Contact Lenses': '👁️'
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '👓'
  });
  const [formError, setFormError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.category-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.4, stagger: 0.08, ease: 'back.out(1.2)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [categories]);

  useEffect(() => {
    if (showModal && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [showModal]);

  // Clear error after 3 seconds
  useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      icon: category.icon
    });
    setFormError(null);
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    // Validate description is not empty
    if (!formData.description.trim()) {
      setFormError('Description is required');
      return false;
    }

    // Validate description length
    if (formData.description.trim().length < 10) {
      setFormError('Description must be at least 10 characters');
      return false;
    }

    if (formData.description.trim().length > 200) {
      setFormError('Description must be less than 200 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id 
          ? { ...c, description: formData.description.trim() }
          : c
      ));
    }
    
    setShowModal(false);
    setFormError(null);
  };

  // Calculate total products across all categories
  const totalProducts = categories.reduce((sum, cat) => sum + cat.productCount, 0);

  return (
    <div ref={containerRef} className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
          <p className="text-gray-500">Organize your optical products</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-violet-600 mt-0.5" />
          <div>
            <p className="text-violet-800 font-medium">Fixed Categories</p>
            <p className="text-violet-600 text-sm mt-1">
              This optical store has {ALLOWED_CATEGORIES.length} predefined categories: {ALLOWED_CATEGORIES.join(', ')}. 
              You can edit the description of each category.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
            </div>
          </div>
        </div>
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl text-2xl">
                {cat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm">{cat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{cat.productCount}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            data-category-id={category.id}
            className="category-card bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center text-4xl">
                {category.icon}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEditModal(category)}
                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  title="Edit description"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{category.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full font-medium">
                {category.productCount} products
              </span>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <FolderTree className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
          <p className="text-gray-500">Something went wrong loading categories</p>
        </div>
      )}

      {/* Edit Modal */}
      {showModal && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Edit {editingCategory.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category Name - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
                <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                  <span className="text-2xl">{categoryIcons[editingCategory.name]}</span>
                  <span className="font-medium text-gray-700">{editingCategory.name}</span>
                  <span className="ml-auto text-xs text-gray-400 bg-gray-200 px-2 py-1 rounded">Read only</span>
                </div>
              </div>

              {/* Description - Editable */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={3}
                  placeholder="Enter category description..."
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {formData.description.length}/200 characters (minimum 10)
                </p>
              </div>

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
                  Update Description
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
