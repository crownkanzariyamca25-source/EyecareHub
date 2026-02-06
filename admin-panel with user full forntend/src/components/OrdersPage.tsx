import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock, X, AlertTriangle, ChevronDown } from 'lucide-react';
import { Order } from '../types';
import { mockOrders } from '../data/mockData';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface StatusOption {
  value: OrderStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const statusOptions: StatusOption[] = [
  { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" />, color: 'text-gray-700', bgColor: 'bg-gray-100' },
  { value: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" />, color: 'text-amber-700', bgColor: 'bg-amber-100' },
  { value: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" />, color: 'text-blue-700', bgColor: 'bg-blue-100' },
  { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" />, color: 'text-red-700', bgColor: 'bg-red-100' },
];

// Valid status transitions - prevents invalid status changes
const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [], // Final state - cannot change
  cancelled: [], // Final state - cannot change
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.order-row',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [orders, statusFilter]);

  useEffect(() => {
    if (selectedOrder && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [selectedOrder]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.status-dropdown-container')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Clear messages after 3 seconds
  useEffect(() => {
    if (statusError) {
      const timer = setTimeout(() => setStatusError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [statusError]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Get allowed transitions for a status
  const getAllowedTransitions = (currentStatus: OrderStatus): StatusOption[] => {
    const allowedStatuses = validTransitions[currentStatus];
    return statusOptions.filter(option => allowedStatuses.includes(option.value));
  };

  // Check if status can be changed
  const canChangeStatus = (currentStatus: OrderStatus): boolean => {
    return validTransitions[currentStatus].length > 0;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
      setStatusError('Order not found');
      return;
    }

    // Validate transition
    const allowedTransitions = validTransitions[order.status];
    if (!allowedTransitions.includes(newStatus)) {
      setStatusError(`Cannot change status from "${order.status}" to "${newStatus}"`);
      setOpenDropdownId(null);
      return;
    }

    // Update the order
    setOrders(prevOrders => 
      prevOrders.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    // Also update selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    setOpenDropdownId(null);
    setSuccessMessage(`Order ${orderId} status updated to ${newStatus}`);
    
    // Animate the status change
    setTimeout(() => {
      gsap.fromTo(`[data-order-id="${orderId}"] .status-badge`,
        { scale: 0.8 },
        { scale: 1, duration: 0.3, ease: 'back.out(2)' }
      );
    }, 50);
  };

  const getStatusConfig = (status: OrderStatus): StatusOption => {
    return statusOptions.find(s => s.value === status) || statusOptions[0];
  };

  const handleDropdownToggle = (e: React.MouseEvent, orderId: string, currentStatus: OrderStatus) => {
    e.stopPropagation();
    
    if (!canChangeStatus(currentStatus)) {
      setStatusError(`"${currentStatus}" is a final state and cannot be changed`);
      return;
    }
    
    setOpenDropdownId(openDropdownId === orderId ? null : orderId);
  };

  const handleStatusSelect = (e: React.MouseEvent, orderId: string, newStatus: OrderStatus) => {
    e.stopPropagation();
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div ref={containerRef} className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <p className="text-gray-500">Manage and track customer orders</p>
      </div>

      {/* Status Error Toast */}
      {statusError && (
        <div className="fixed top-4 right-4 z-[100] bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          <span>{statusError}</span>
          <button onClick={() => setStatusError(null)} className="ml-2 text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-[100] bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="ml-2 text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, email or product..."
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
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ({orders.length})
          </button>
          {statusOptions.map((status) => {
            const count = orders.filter(o => o.status === status.value).length;
            return (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  statusFilter === status.value ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {status.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Flow Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Order Flow:</strong> Pending → Processing → Shipped → Delivered (or Cancelled at any step before delivery)
        </p>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100" style={{ overflow: 'visible' }}>
        <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
          <table className="w-full min-w-[700px]" style={{ overflow: 'visible' }}>
            <thead className="bg-gray-50">
              <tr className="text-left text-gray-500 text-sm">
                <th className="py-4 px-6 font-medium">Order ID</th>
                <th className="py-4 px-6 font-medium">Customer</th>
                <th className="py-4 px-6 font-medium">Products</th>
                <th className="py-4 px-6 font-medium">Total</th>
                <th className="py-4 px-6 font-medium">Date</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const allowedTransitions = getAllowedTransitions(order.status);
                const isChangeable = canChangeStatus(order.status);
                const isDropdownOpen = openDropdownId === order.id;
                
                return (
                  <tr key={order.id} data-order-id={order.id} className="order-row hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-gray-600 text-sm">{order.products.join(', ')}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600">{order.date}</span>
                    </td>
                    <td className="py-4 px-6 relative">
                      <div className="status-dropdown-container">
                        <button
                          onClick={(e) => handleDropdownToggle(e, order.id, order.status)}
                          disabled={!isChangeable}
                          className={`status-badge flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${statusConfig.bgColor} ${statusConfig.color} ${
                            isChangeable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-75'
                          }`}
                          title={!isChangeable ? `${order.status} is a final state` : 'Click to change status'}
                        >
                          {statusConfig.icon}
                          {statusConfig.label}
                          {isChangeable && <ChevronDown className={`w-3 h-3 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />}
                        </button>
                      </div>
                      
                      {/* Dropdown Portal - Rendered outside table cell for proper z-index */}
                      {isDropdownOpen && allowedTransitions.length > 0 && (
                        <div 
                          className="fixed bg-white border border-gray-200 rounded-xl shadow-2xl py-2 min-w-[180px]"
                          style={{ 
                            zIndex: 99999,
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            marginTop: '8px'
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <p className="px-4 py-1 text-xs text-gray-400 font-medium uppercase">Change to:</p>
                          {allowedTransitions.map((status) => (
                            <button
                              key={status.value}
                              onClick={(e) => handleStatusSelect(e, order.id, status.value)}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm hover:bg-gray-50 transition-colors"
                            >
                              <span className={`p-1.5 rounded ${status.bgColor} ${status.color}`}>{status.icon}</span>
                              <span className="font-medium">{status.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
                        title="View order details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div
            ref={modalRef}
            className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.date}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Customer</p>
                <p className="font-semibold text-gray-900">{selectedOrder.customer}</p>
                <p className="text-gray-600">{selectedOrder.email}</p>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Products</p>
                <div className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{product}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-violet-600">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusConfig(selectedOrder.status).bgColor} ${getStatusConfig(selectedOrder.status).color}`}>
                  {getStatusConfig(selectedOrder.status).icon}
                  {getStatusConfig(selectedOrder.status).label}
                </div>
                
                {/* Quick status change in modal */}
                {canChangeStatus(selectedOrder.status) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Quick Actions:</p>
                    <div className="flex gap-2 flex-wrap">
                      {getAllowedTransitions(selectedOrder.status).map((status) => (
                        <button
                          key={status.value}
                          onClick={() => updateOrderStatus(selectedOrder.id, status.value)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${status.bgColor} ${status.color} hover:opacity-80 transition-opacity`}
                        >
                          {status.icon}
                          Mark as {status.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {!canChangeStatus(selectedOrder.status) && (
                  <p className="text-sm text-gray-400 mt-2 italic">
                    This order has reached its final state and cannot be changed.
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-purple-500 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
