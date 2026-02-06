import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

interface OrdersProps {
  onNavigate: (page: string) => void;
}

export const Orders: React.FC<OrdersProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const allOrders = JSON.parse(localStorage.getItem('eyecare_orders') || '[]');
      const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
      setOrders(userOrders.reverse());
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Please login to view orders</h2>
          <button
            onClick={() => onNavigate('login')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
            <button
              onClick={() => onNavigate('products')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Order Header */}
                <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Order ID</div>
                    <div className="font-semibold text-gray-900">{order.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Order Date</div>
                    <div className="font-medium">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                    <div className="font-bold text-lg">₹{order.total.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item) => {
                      const discountedPrice = item.product.price * (1 - item.product.discount / 100);
                      return (
                        <div key={item.product.id} className="flex gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                            <p className="text-sm text-gray-600">{item.product.brand}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                              <span className="font-semibold">₹{(discountedPrice * item.quantity).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                    <p className="text-gray-600 text-sm">
                      {order.shippingAddress.name}<br />
                      {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}
                      {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>

                  {/* Order Tracking */}
                  {order.status !== 'cancelled' && (
                    <div className="mt-6">
                      <div className="flex justify-between items-center">
                        <div className={`flex-1 text-center ${order.status !== 'pending' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
                            {order.status !== 'pending' ? '✓' : '1'}
                          </div>
                          <div className="text-xs">Order Placed</div>
                        </div>
                        <div className={`flex-1 h-0.5 ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex-1 text-center ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
                            {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? '✓' : '2'}
                          </div>
                          <div className="text-xs">Processing</div>
                        </div>
                        <div className={`flex-1 h-0.5 ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex-1 text-center ${order.status === 'shipped' || order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
                            {order.status === 'shipped' || order.status === 'delivered' ? '✓' : '3'}
                          </div>
                          <div className="text-xs">Shipped</div>
                        </div>
                        <div className={`flex-1 h-0.5 ${order.status === 'delivered' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                        <div className={`flex-1 text-center ${order.status === 'delivered' ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className="w-8 h-8 mx-auto rounded-full border-2 flex items-center justify-center mb-2">
                            {order.status === 'delivered' ? '✓' : '4'}
                          </div>
                          <div className="text-xs">Delivered</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
