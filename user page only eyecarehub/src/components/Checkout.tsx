import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address, Order } from '../types';

interface CheckoutProps {
  onNavigate: (page: string, orderId?: string) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, updateProfile } = useAuth();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const total = getCartTotal();
  const shipping = total > 5000 ? 0 : 99;
  const finalTotal = total + shipping;

  const handleAddAddress = () => {
    if (!user) return;
    
    const newAddress: Address = {
      id: Date.now().toString(),
      ...addressForm,
      isDefault: user.addresses.length === 0
    };

    updateProfile({
      addresses: [...user.addresses, newAddress]
    });

    setSelectedAddress(newAddress);
    setShowAddressForm(false);
    setAddressForm({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  const handlePayment = () => {
    if (!user || !selectedAddress) return;

    // Simulate Razorpay payment
    const options = {
      key: 'rzp_test_example',
      amount: finalTotal * 100,
      currency: 'INR',
      name: 'EyeCare Hub',
      description: 'Order Payment',
      handler: function (response: any) {
        // Create order
        const order: Order = {
          id: 'ORD' + Date.now(),
          userId: user.id,
          items: cart,
          total: finalTotal,
          status: 'processing',
          shippingAddress: selectedAddress,
          paymentId: response.razorpay_payment_id || 'PAY' + Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Save order
        const orders = JSON.parse(localStorage.getItem('eyecare_orders') || '[]');
        orders.push(order);
        localStorage.setItem('eyecare_orders', JSON.stringify(orders));

        clearCart();
        onNavigate('order-success', order.id);
      }
    };

    // Simulate payment success
    setTimeout(() => {
      options.handler({ razorpay_payment_id: 'PAY' + Date.now() });
    }, 1000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step === 'address' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'address' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>1</div>
              <span className="font-medium">Address</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-indigo-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
              }`}>2</div>
              <span className="font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'address' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Select Delivery Address</h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    + Add New
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddressForm && (
                  <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold mb-4">New Address</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={addressForm.name}
                        onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={addressForm.addressLine1}
                        onChange={(e) => setAddressForm({...addressForm, addressLine1: e.target.value})}
                        className="px-4 py-2 border rounded-lg md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={addressForm.addressLine2}
                        onChange={(e) => setAddressForm({...addressForm, addressLine2: e.target.value})}
                        className="px-4 py-2 border rounded-lg md:col-span-2"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({...addressForm, state: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Pincode"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <button
                      onClick={handleAddAddress}
                      className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Save Address
                    </button>
                  </div>
                )}

                {/* Address List */}
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? 'border-indigo-600 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{address.name}</h3>
                          <p className="text-gray-600 text-sm mt-1">{address.phone}</p>
                          <p className="text-gray-600 text-sm mt-2">
                            {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                        {selectedAddress?.id === address.id && (
                          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {user.addresses.length === 0 && !showAddressForm && (
                  <div className="text-center py-8 text-gray-500">
                    No saved addresses. Please add a new address.
                  </div>
                )}

                <button
                  onClick={() => selectedAddress && setStep('payment')}
                  disabled={!selectedAddress}
                  className={`mt-6 w-full px-6 py-3 rounded-lg font-semibold ${
                    selectedAddress
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 border-2 border-indigo-600 rounded-xl bg-indigo-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold">Razorpay</h3>
                        <p className="text-sm text-gray-600">UPI, Cards, NetBanking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('address')}
                    className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:border-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-xl transition-all"
                  >
                    Pay ₹{finalTotal.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.images[0]} alt="" className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
