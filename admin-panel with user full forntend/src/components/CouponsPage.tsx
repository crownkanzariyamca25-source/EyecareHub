import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Plus, Edit2, Trash2, X, Ticket, Copy, Check, Percent, DollarSign, AlertCircle, Search } from 'lucide-react';
import { Coupon } from '../types';
import { mockCoupons } from '../data/mockData';

interface FormData {
  code: string;
  discount: string;
  type: 'percentage' | 'fixed';
  minOrder: string;
  expiryDate: string;
  usageLimit: string;
}

const initialFormData: FormData = {
  code: '',
  discount: '',
  type: 'percentage',
  minOrder: '',
  expiryDate: '',
  usageLimit: ''
};

export function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.coupon-card',
        { y: 30, opacity: 0, rotateX: -10 },
        { y: 0, opacity: 1, rotateX: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.2)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [coupons]);

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

  // Filter coupons based on search
  const filteredCoupons = coupons.filter(coupon => 
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setToast({ type: 'success', message: `Copied "${code}" to clipboard` });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openAddModal = () => {
    setEditingCoupon(null);
    setFormData(initialFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      type: coupon.type,
      minOrder: coupon.minOrder.toString(),
      expiryDate: coupon.expiryDate,
      usageLimit: coupon.usageLimit.toString()
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof FormData, string>> = {};

    // Validate code
    const codeRegex = /^[A-Z0-9]{3,20}$/;
    if (!formData.code.trim()) {
      errors.code = 'Coupon code is required';
    } else if (!codeRegex.test(formData.code.toUpperCase())) {
      errors.code = 'Code must be 3-20 alphanumeric characters';
    }

    // Check for duplicate codes (excluding current coupon if editing)
    const duplicateCode = coupons.find(
      c => c.code.toUpperCase() === formData.code.trim().toUpperCase() && 
           c.id !== editingCoupon?.id
    );
    if (duplicateCode) {
      errors.code = 'This coupon code already exists';
    }

    // Validate discount
    const discount = parseFloat(formData.discount);
    if (!formData.discount) {
      errors.discount = 'Discount value is required';
    } else if (isNaN(discount) || discount <= 0) {
      errors.discount = 'Discount must be a positive number';
    } else if (formData.type === 'percentage' && discount > 100) {
      errors.discount = 'Percentage discount cannot exceed 100%';
    } else if (formData.type === 'fixed' && discount > 10000) {
      errors.discount = 'Fixed discount cannot exceed $10,000';
    }

    // Validate min order
    const minOrder = parseFloat(formData.minOrder);
    if (!formData.minOrder) {
      errors.minOrder = 'Minimum order is required';
    } else if (isNaN(minOrder) || minOrder < 0) {
      errors.minOrder = 'Minimum order must be 0 or greater';
    } else if (minOrder > 99999) {
      errors.minOrder = 'Minimum order cannot exceed $99,999';
    }

    // Validate that fixed discount doesn't exceed min order
    if (formData.type === 'fixed' && !errors.discount && !errors.minOrder) {
      if (discount > minOrder) {
        errors.discount = 'Fixed discount cannot exceed minimum order amount';
      }
    }

    // Validate usage limit
    const usageLimit = parseInt(formData.usageLimit);
    if (!formData.usageLimit) {
      errors.usageLimit = 'Usage limit is required';
    } else if (isNaN(usageLimit) || usageLimit <= 0) {
      errors.usageLimit = 'Usage limit must be at least 1';
    } else if (usageLimit > 99999) {
      errors.usageLimit = 'Usage limit cannot exceed 99,999';
    } else if (!Number.isInteger(usageLimit)) {
      errors.usageLimit = 'Usage limit must be a whole number';
    }

    // If editing, check that new usage limit isn't less than current usage
    if (editingCoupon && !errors.usageLimit) {
      if (usageLimit < editingCoupon.usageCount) {
        errors.usageLimit = `Usage limit cannot be less than current usage (${editingCoupon.usageCount})`;
      }
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      errors.expiryDate = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isNaN(expiryDate.getTime())) {
        errors.expiryDate = 'Invalid date format';
      } else if (expiryDate < today && !editingCoupon) {
        errors.expiryDate = 'Expiry date cannot be in the past';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingCoupon) {
      setCoupons(coupons.map(c => 
        c.id === editingCoupon.id 
          ? { 
              ...c, 
              code: formData.code.toUpperCase().trim(),
              discount: parseFloat(formData.discount),
              type: formData.type,
              minOrder: parseFloat(formData.minOrder),
              expiryDate: formData.expiryDate,
              usageLimit: parseInt(formData.usageLimit)
            }
          : c
      ));
      setToast({ type: 'success', message: `Coupon "${formData.code.toUpperCase()}" updated successfully` });
    } else {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: formData.code.toUpperCase().trim(),
        discount: parseFloat(formData.discount),
        type: formData.type,
        minOrder: parseFloat(formData.minOrder),
        expiryDate: formData.expiryDate,
        status: 'active',
        usageCount: 0,
        usageLimit: parseInt(formData.usageLimit)
      };
      setCoupons([...coupons, newCoupon]);
      setToast({ type: 'success', message: `Coupon "${formData.code.toUpperCase()}" created successfully` });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    
    if (!coupon) return;

    // First click - show confirmation
    if (deleteConfirm !== id) {
      if (coupon.usageCount > 0) {
        setToast({ type: 'error', message: `Warning: "${coupon.code}" has been used ${coupon.usageCount} times. Click again to confirm delete.` });
      } else {
        setToast({ type: 'error', message: `Click delete again to confirm removing "${coupon.code}"` });
      }
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 5000);
      return;
    }

    // Second click - actually delete
    gsap.to(`[data-coupon-id="${id}"]`, {
      scale: 0.8,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCoupons(coupons.filter(c => c.id !== id));
        setDeleteConfirm(null);
        setToast({ type: 'success', message: `Coupon "${coupon.code}" deleted successfully` });
      }
    });
  };

  const toggleCouponStatus = (id: string) => {
    const coupon = coupons.find(c => c.id === id);
    if (!coupon) return;

    // Cannot enable an expired coupon
    if (coupon.status === 'expired') {
      setToast({ type: 'error', message: 'Cannot enable an expired coupon. Please update the expiry date first.' });
      return;
    }

    // Cannot enable if fully used
    if (coupon.status === 'disabled' && coupon.usageCount >= coupon.usageLimit) {
      setToast({ type: 'error', message: 'Cannot enable this coupon as it has reached its usage limit.' });
      return;
    }

    const newStatus = coupon.status === 'active' ? 'disabled' : 'active';
    setCoupons(coupons.map(c => 
      c.id === id 
        ? { ...c, status: newStatus as Coupon['status'] }
        : c
    ));
    setToast({ type: 'success', message: `Coupon "${coupon.code}" ${newStatus === 'active' ? 'enabled' : 'disabled'}` });
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Discounts & Coupons</h2>
          <p className="text-gray-500">Create and manage promotional codes</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          Create Coupon
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search coupons by code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
              <Ticket className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Active Coupons</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Usage</p>
              <p className="text-2xl font-bold text-gray-900">{coupons.reduce((acc, c) => acc + c.usageCount, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {filteredCoupons.map((coupon) => (
          <div
            key={coupon.id}
            data-coupon-id={coupon.id}
            className="coupon-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            {/* Coupon Header */}
            <div className={`p-5 ${
              coupon.status === 'active' 
                ? 'bg-gradient-to-r from-violet-500 to-purple-600' 
                : coupon.status === 'expired'
                ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {coupon.type === 'percentage' ? (
                    <Percent className="w-5 h-5 text-white/80" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-white/80" />
                  )}
                  <span className="text-white/80 text-sm font-medium">
                    {coupon.type === 'percentage' ? 'Percentage Off' : 'Fixed Amount'}
                  </span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  coupon.status === 'active' ? 'bg-white/20 text-white' :
                  coupon.status === 'expired' ? 'bg-black/20 text-white' :
                  'bg-black/20 text-white'
                }`}>
                  {coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}
                </span>
              </div>
              <div className="text-4xl font-bold text-white mb-2">
                {coupon.type === 'percentage' ? `${coupon.discount}%` : `$${coupon.discount.toFixed(2)}`}
              </div>
              <div className="flex items-center gap-2">
                <code className="bg-white/20 text-white px-3 py-1.5 rounded-lg font-mono text-lg">
                  {coupon.code}
                </code>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Copy code"
                >
                  {copiedCode === coupon.code ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <Copy className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </div>

            {/* Coupon Details */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Min. Order</p>
                  <p className="font-semibold text-gray-900">${coupon.minOrder.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Expires</p>
                  <p className="font-semibold text-gray-900">{coupon.expiryDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Used</p>
                  <p className="font-semibold text-gray-900">{coupon.usageCount} / {coupon.usageLimit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Remaining</p>
                  <p className="font-semibold text-gray-900">{Math.max(0, coupon.usageLimit - coupon.usageCount)}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      (coupon.usageCount / coupon.usageLimit) >= 0.9 
                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                        : 'bg-gradient-to-r from-violet-500 to-purple-600'
                    }`}
                    style={{ width: `${Math.min(100, (coupon.usageCount / coupon.usageLimit) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {Math.round((coupon.usageCount / coupon.usageLimit) * 100)}% used
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleCouponStatus(coupon.id)}
                  disabled={coupon.status === 'expired'}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    coupon.status === 'active'
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : coupon.status === 'expired'
                      ? 'bg-gray-50 text-gray-400'
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  }`}
                >
                  {coupon.status === 'active' ? 'Disable' : coupon.status === 'expired' ? 'Expired' : 'Enable'}
                </button>
                <button
                  onClick={() => openEditModal(coupon)}
                  className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                  title="Edit coupon"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(coupon.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    deleteConfirm === coupon.id
                      ? 'bg-red-500 text-white'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                  }`}
                  title={deleteConfirm === coupon.id ? 'Click again to confirm delete' : 'Delete coupon'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Delete warning for used coupons */}
              {coupon.usageCount > 0 && (
                <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Used {coupon.usageCount} times - delete will affect records
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredCoupons.length === 0 && searchTerm && (
        <div className="text-center py-16">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
          <p className="text-gray-500">No coupons match "{searchTerm}"</p>
        </div>
      )}

      {coupons.length === 0 && (
        <div className="text-center py-16">
          <Ticket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
          <p className="text-gray-500">Create your first promotional coupon</p>
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
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') });
                    if (formErrors.code) setFormErrors({ ...formErrors, code: undefined });
                  }}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono uppercase ${
                    formErrors.code ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="SUMMER20"
                  maxLength={20}
                />
                {formErrors.code && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.code}
                  </p>
                )}
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    className="w-full border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount {formData.type === 'percentage' ? '(%)' : '($)'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step={formData.type === 'percentage' ? '1' : '0.01'}
                    min="0.01"
                    max={formData.type === 'percentage' ? '100' : '10000'}
                    value={formData.discount}
                    onChange={(e) => {
                      setFormData({ ...formData, discount: e.target.value });
                      if (formErrors.discount) setFormErrors({ ...formErrors, discount: undefined });
                    }}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.discount ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                  />
                  {formErrors.discount && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.discount}</p>
                  )}
                </div>
              </div>

              {/* Min Order & Usage Limit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min. Order ($) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="99999"
                    value={formData.minOrder}
                    onChange={(e) => {
                      setFormData({ ...formData, minOrder: e.target.value });
                      if (formErrors.minOrder) setFormErrors({ ...formErrors, minOrder: undefined });
                    }}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.minOrder ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="50.00"
                  />
                  {formErrors.minOrder && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.minOrder}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Usage Limit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="99999"
                    value={formData.usageLimit}
                    onChange={(e) => {
                      setFormData({ ...formData, usageLimit: e.target.value });
                      if (formErrors.usageLimit) setFormErrors({ ...formErrors, usageLimit: undefined });
                    }}
                    className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                      formErrors.usageLimit ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="100"
                  />
                  {formErrors.usageLimit && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.usageLimit}</p>
                  )}
                </div>
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => {
                    setFormData({ ...formData, expiryDate: e.target.value });
                    if (formErrors.expiryDate) setFormErrors({ ...formErrors, expiryDate: undefined });
                  }}
                  min={editingCoupon ? undefined : new Date().toISOString().split('T')[0]}
                  className={`w-full border rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500 ${
                    formErrors.expiryDate ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                />
                {formErrors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.expiryDate}
                  </p>
                )}
              </div>

              {/* Editing warning */}
              {editingCoupon && editingCoupon.usageCount > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-amber-700 text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    This coupon has been used {editingCoupon.usageCount} times. Changes will affect future usage only.
                  </p>
                </div>
              )}

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
                  {editingCoupon ? 'Update' : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
