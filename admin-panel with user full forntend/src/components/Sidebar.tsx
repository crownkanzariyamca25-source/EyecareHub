import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingCart, 
  Users, 
  Ticket, 
  LogOut,
  Shield,
  X,
  Settings
} from 'lucide-react';
import { ActivePage } from '../types';
import { cn } from '../utils/cn';

interface SidebarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const menuItems: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'products', label: 'Products', icon: <Package className="w-5 h-5" /> },
  { id: 'categories', label: 'Categories', icon: <FolderTree className="w-5 h-5" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
  { id: 'users', label: 'Users', icon: <Users className="w-5 h-5" /> },
  { id: 'coupons', label: 'Coupons', icon: <Ticket className="w-5 h-5" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ activePage, setActivePage, onLogout, isOpen, onClose }: SidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(menuItemsRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.2 }
      );
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  const handlePageChange = (page: ActivePage) => {
    setActivePage(page);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 flex flex-col transform transition-transform duration-300 lg:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">AdminPanel</h2>
                <p className="text-gray-500 text-xs">Management System</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-4 mb-3">Menu</p>
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => { menuItemsRef.current[index] = el; }}
              onClick={() => handlePageChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activePage === item.id
                  ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className={cn(
                "transition-transform duration-200",
                activePage === item.id ? "scale-110" : "group-hover:scale-110"
              )}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activePage === item.id && (
                <span className="ml-auto w-2 h-2 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
