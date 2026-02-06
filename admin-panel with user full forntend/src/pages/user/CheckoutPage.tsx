import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CreditCard, Truck, Check, AlertCircle, ChevronLeft, Shield, Lock } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth, Address } from '../../contexts/AuthContext';

interface CheckoutPageProps {
  onNavigate: (page: string, data?: Record<string, unknown>) => void;
}

export function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { items, getCartTotal, appliedCoupon, checkout } = useCart();
  const { user, addresses } = useAuth();
  
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(addresses[0] || null);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount)
    : 0;
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal - discountAmount + shipping;

  useEffect(() => {
    if (items.length === 0 && step !== 'success') {
      onNavigate('cart');
    }
  }, [items, step, onNavigate]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.checkout-section',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [step]);

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate Razorpay payment
      if (paymentMethod === 'razorpay') {
        // In a real app, this would open Razorpay payment modal
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      const result = await checkout(
        paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery',
        {
          name: selectedAddress.name,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country
        }
      );

      if (result.success) {
        setOrderId(result.orderId || null);
        setStep('success');
      } else {
        setError(result.message);
      }
    } catch {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. Your order ID is <span className="font-semibold text-violet-600">{orderId}</span>
          </p>
          <p className="text-gray-500 mb-8">
            We've sent a confirmation email to <span className="font-medium">{user?.email}</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('orders')}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
            >
              View Order Details
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('cart')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-violet-600' : 'text-emerald-600'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'shipping' ? 'bg-violet-600 text-white' : 'bg-emerald-600 text-white'
          }`}>
            {step === 'shipping' ? '1' : <Check className="w-5 h-5" />}
          </div>
          <span className="font-medium">Shipping</span>
        </div>
        <div className="flex-1 h-1 bg-gray-200 rounded">
          <div className={`h-full rounded transition-all ${step === 'payment' ? 'w-full bg-violet-600' : 'w-0'}`} />
        </div>
        <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-violet-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step === 'payment' ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className="font-medium">Payment</span>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 'shipping' && (
            <div className="checkout-section space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
                  <button
                    onClick={() => onNavigate('addresses')}
                    className="text-violet-600 text-sm font-medium hover:text-violet-700"
                  >
                    Manage Addresses
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No saved addresses</p>
                    <button
                      onClick={() => onNavigate('addresses')}
                      className="text-violet-600 font-medium hover:text-violet-700"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <button
                        key={address.id}
                        onClick={() => setSelectedAddress(address)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                          selectedAddress?.id === address.id
                            ? 'border-violet-500 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-gray-900">{address.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                address.type === 'home' ? 'bg-blue-100 text-blue-700' :
                                address.type === 'work' ? 'bg-amber-100 text-amber-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {address.type.charAt(0).toUpperCase() + address.type.slice(1)}
                              </span>
                              {address.isDefault && (
                                <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{address.street}</p>
                            <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                            <p className="text-gray-500 text-sm mt-1">📞 {address.phone}</p>
                          </div>
                          {selectedAddress?.id === address.id && (
                            <Check className="w-5 h-5 text-violet-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep('payment')}
                disabled={!selectedAddress}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="checkout-section space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4">
                  <button
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'razorpay'
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Pay with Razorpay</p>
                        <p className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking, Wallets</p>
                      </div>
                      {paymentMethod === 'razorpay' && (
                        <Check className="w-5 h-5 text-violet-600" />
                      )}
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('cod')}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                        <Truck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <Check className="w-5 h-5 text-violet-600" />
                      )}
                    </div>
                  </button>
                </div>

                {/* Security Note */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700">Secure Payment</p>
                    <p>Your payment information is encrypted and secure. We never store your card details.</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Shipping to</h3>
                  <button
                    onClick={() => setStep('shipping')}
                    className="text-violet-600 text-sm font-medium hover:text-violet-700"
                  >
                    Change
                  </button>
                </div>
                {selectedAddress && (
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-900">{selectedAddress.name}</p>
                    <p>{selectedAddress.street}</p>
                    <p>{selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}</p>
                    <p>{selectedAddress.phone}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('shipping')}
                  className="px-6 py-4 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex-1 py-4 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-emerald-600">FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
