import { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  image: string;
  category: string;
  brand: string;
  frameType?: string;
  lensType?: string;
}

export interface UserOrder {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

interface CartContextType {
  items: CartItem[];
  orders: UserOrder[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  applyCoupon: (code: string) => { success: boolean; discount: number; message: string };
  removeCoupon: () => void;
  appliedCoupon: { code: string; discount: number; type: 'percentage' | 'fixed' } | null;
  checkout: (paymentMethod: string, shippingAddress: UserOrder['shippingAddress']) => Promise<{ success: boolean; orderId?: string; message: string }>;
  getOrderById: (id: string) => UserOrder | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Available coupons
const availableCoupons = [
  { code: 'WELCOME20', discount: 20, type: 'percentage' as const, minOrder: 50 },
  { code: 'FLAT10', discount: 10, type: 'fixed' as const, minOrder: 30 },
  { code: 'SUMMER25', discount: 25, type: 'percentage' as const, minOrder: 100 },
  { code: 'EYECARE15', discount: 15, type: 'percentage' as const, minOrder: 75 }
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([
    // Sample order history
    {
      id: 'ORD-001',
      items: [
        { id: '1', productId: '1', name: 'Classic Round Eyeglasses', price: 149.99, quantity: 1, image: '👓', category: 'Eyeglasses', brand: 'Ray-Ban' }
      ],
      subtotal: 149.99,
      discount: 0,
      shipping: 0,
      total: 149.99,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'Razorpay',
      shippingAddress: {
        name: 'Test User',
        phone: '+1 234 567 8900',
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States'
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-20T14:00:00Z',
      trackingNumber: 'TRK123456789',
      estimatedDelivery: '2024-01-20'
    }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; type: 'percentage' | 'fixed' } | null>(null);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'>, quantity: number = 1) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.productId === item.productId);
      if (existingItem) {
        return prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: Math.min(i.quantity + quantity, 10) }
            : i
        );
      }
      return [...prev, { ...item, id: Date.now().toString(), quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    if (quantity > 10) {
      quantity = 10;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const applyCoupon = (code: string): { success: boolean; discount: number; message: string } => {
    const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { success: false, discount: 0, message: 'Invalid coupon code' };
    }
    
    const cartTotal = getCartTotal();
    if (cartTotal < coupon.minOrder) {
      return { success: false, discount: 0, message: `Minimum order of $${coupon.minOrder} required for this coupon` };
    }
    
    const discountAmount = coupon.type === 'percentage' 
      ? (cartTotal * coupon.discount) / 100 
      : coupon.discount;
    
    setAppliedCoupon({ code: coupon.code, discount: coupon.discount, type: coupon.type });
    
    return { 
      success: true, 
      discount: discountAmount, 
      message: `Coupon applied! You save $${discountAmount.toFixed(2)}` 
    };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const checkout = async (paymentMethod: string, shippingAddress: UserOrder['shippingAddress']): Promise<{ success: boolean; orderId?: string; message: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (items.length === 0) {
      return { success: false, message: 'Cart is empty' };
    }
    
    const subtotal = getCartTotal();
    const discountAmount = appliedCoupon 
      ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount)
      : 0;
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const total = subtotal - discountAmount + shipping;
    
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const newOrder: UserOrder = {
      id: orderId,
      items: [...items],
      subtotal,
      discount: discountAmount,
      shipping,
      total,
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod,
      shippingAddress,
      couponCode: appliedCoupon?.code,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    return { success: true, orderId, message: 'Order placed successfully!' };
  };

  const getOrderById = (id: string): UserOrder | undefined => {
    return orders.find(order => order.id === id);
  };

  return (
    <CartContext.Provider value={{
      items,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartCount,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      checkout,
      getOrderById
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
