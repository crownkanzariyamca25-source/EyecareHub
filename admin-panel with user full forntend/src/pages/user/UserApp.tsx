import { useState } from 'react';
import { AuthProvider } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';
import { UserLayout } from './UserLayout';
import { HomePage } from './HomePage';
import { ProductsPage } from './ProductsPage';
import { ProductDetailPage } from './ProductDetailPage';
import { CartPage } from './CartPage';
import { CheckoutPage } from './CheckoutPage';
import { AuthPages } from './AuthPages';
import { OrdersPage } from './OrdersPage';
import { ProfilePage } from './ProfilePage';
import { AddressesPage } from './AddressesPage';

type UserPage = 
  | 'home' 
  | 'products' 
  | 'eyeglasses' 
  | 'sunglasses' 
  | 'contacts' 
  | 'product-detail'
  | 'cart' 
  | 'checkout' 
  | 'login' 
  | 'register' 
  | 'forgot-password'
  | 'profile' 
  | 'orders' 
  | 'addresses'
  | 'settings';

export function UserApp() {
  const [activePage, setActivePage] = useState<UserPage>('home');
  const [pageData, setPageData] = useState<Record<string, unknown>>({});

  const handleNavigate = (page: string, data?: Record<string, unknown>) => {
    setActivePage(page as UserPage);
    if (data) {
      setPageData(data);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} />;
      
      case 'eyeglasses':
        return <ProductsPage onNavigate={handleNavigate} categoryFilter="Eyeglasses" />;
      
      case 'sunglasses':
        return <ProductsPage onNavigate={handleNavigate} categoryFilter="Sunglasses" />;
      
      case 'contacts':
        return <ProductsPage onNavigate={handleNavigate} categoryFilter="Contact Lenses" />;
      
      case 'product-detail':
        return <ProductDetailPage productId={pageData.productId as string} onNavigate={handleNavigate} />;
      
      case 'cart':
        return <CartPage onNavigate={handleNavigate} />;
      
      case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      
      case 'login':
        return <AuthPages type="login" onNavigate={handleNavigate} />;
      
      case 'register':
        return <AuthPages type="register" onNavigate={handleNavigate} />;
      
      case 'forgot-password':
        return <AuthPages type="forgot-password" onNavigate={handleNavigate} />;
      
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      
      case 'orders':
        return <OrdersPage onNavigate={handleNavigate} />;
      
      case 'addresses':
        return <AddressesPage onNavigate={handleNavigate} />;
      
      case 'settings':
        return <ProfilePage onNavigate={handleNavigate} />;
      
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Pages that don't need the layout
  const noLayoutPages = ['login', 'register', 'forgot-password'];

  if (noLayoutPages.includes(activePage)) {
    return (
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700">
            {renderPage()}
          </div>
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <UserLayout activePage={activePage} onNavigate={handleNavigate}>
          {renderPage()}
        </UserLayout>
      </CartProvider>
    </AuthProvider>
  );
}
