import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Login } from './components/Login';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ProductsPage } from './components/ProductsPage';
import { CategoriesPage } from './components/CategoriesPage';
import { OrdersPage } from './components/OrdersPage';
import { UsersPage } from './components/UsersPage';
import { CouponsPage } from './components/CouponsPage';
import { SettingsPage } from './components/SettingsPage';
import { UserApp } from './pages/user/UserApp';
import { ActivePage } from './types';
import { Eye, Shield } from 'lucide-react';

const pageTitles: Record<ActivePage, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  categories: 'Categories',
  orders: 'Orders',
  users: 'Users',
  coupons: 'Discounts & Coupons',
  settings: 'Settings'
};

type AppMode = 'user' | 'admin';

export function App() {
  const [mode, setMode] = useState<AppMode>('user');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoggedIn && mainRef.current) {
      gsap.fromTo(mainRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [activePage, isLoggedIn]);

  const handleLogout = () => {
    gsap.to('.admin-panel', {
      opacity: 0,
      scale: 0.98,
      duration: 0.3,
      onComplete: () => setIsLoggedIn(false)
    });
  };

  // Mode Switcher Component
  const ModeSwitcher = () => (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2 flex gap-2">
        <button
          onClick={() => setMode('user')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            mode === 'user'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="hidden sm:inline">User Store</span>
        </button>
        <button
          onClick={() => setMode('admin')}
          className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
            mode === 'admin'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span className="hidden sm:inline">Admin Panel</span>
        </button>
      </div>
    </div>
  );

  // User Mode
  if (mode === 'user') {
    return (
      <>
        <UserApp />
        <ModeSwitcher />
      </>
    );
  }

  // Admin Mode - Login Screen
  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={() => setIsLoggedIn(true)} />
        <ModeSwitcher />
      </>
    );
  }

  // Admin Mode - Dashboard
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'orders':
        return <OrdersPage />;
      case 'users':
        return <UsersPage />;
      case 'coupons':
        return <CouponsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <div className="admin-panel flex min-h-screen bg-gray-50">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <Header 
            title={pageTitles[activePage]} 
            onMenuClick={() => setSidebarOpen(true)}
          />
          
          <main ref={mainRef} className="flex-1 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
      <ModeSwitcher />
    </>
  );
}
