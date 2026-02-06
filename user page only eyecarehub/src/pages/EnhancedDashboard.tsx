import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, Bell, Settings, LogOut, TrendingUp, ShoppingBag, Eye, Award, ChevronRight, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'delivered' | 'shipped' | 'processing';
  items: number;
  image: string;
}

const recentOrders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-01-15',
    total: 2999,
    status: 'delivered',
    items: 1,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200'
  },
  {
    id: 'ORD002',
    date: '2024-01-10',
    total: 4298,
    status: 'shipped',
    items: 2,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200'
  },
  {
    id: 'ORD003',
    date: '2024-01-05',
    total: 1999,
    status: 'processing',
    items: 1,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=200'
  },
];

const favorites = [
  { id: 1, name: 'Classic Aviator', price: 2999, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200' },
  { id: 2, name: 'Round Frame', price: 1999, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200' },
  { id: 3, name: 'Cat Eye Style', price: 2499, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=200' },
];

export default function EnhancedDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    gsap.from('.dashboard-card', {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.stats-card', {
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }, [activeTab]);

  const stats = [
    { icon: ShoppingBag, label: 'Total Orders', value: '24', color: 'from-blue-500 to-cyan-500', trend: '+12%' },
    { icon: Package, label: 'Active Orders', value: '3', color: 'from-purple-500 to-pink-500', trend: '+2' },
    { icon: Heart, label: 'Wishlist Items', value: '12', color: 'from-red-500 to-orange-500', trend: '+5' },
    { icon: Award, label: 'Reward Points', value: '2,450', color: 'from-green-500 to-emerald-500', trend: '+120' },
  ];

  const menuItems = [
    { id: 'overview', icon: TrendingUp, label: 'Overview', active: true },
    { id: 'orders', icon: Package, label: 'My Orders', badge: '3' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist', badge: '12' },
    { id: 'addresses', icon: MapPin, label: 'Addresses' },
    { id: 'payment', icon: CreditCard, label: 'Payment Methods' },
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: '5' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'shipped':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome back, {user?.name || 'Guest'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and track your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="stats-card bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-24">
              {/* Profile */}
              <div className="text-center mb-6 pb-6 border-b border-gray-200">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0) || 'G'}
                </div>
                <h3 className="font-bold text-xl text-gray-900">{user?.name || 'Guest User'}</h3>
                <p className="text-sm text-gray-500">{user?.email || 'guest@example.com'}</p>
                <Link
                  to="/virtual-tryon"
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:shadow-lg transition-all hover:scale-105"
                >
                  <Eye className="w-4 h-4" />
                  Try Virtual Try-On
                </Link>
              </div>

              {/* Menu */}
              <nav className="space-y-2">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        activeTab === item.id ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Recent Orders */}
                <div className="dashboard-card bg-white rounded-3xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-6 h-6 text-purple-600" />
                      Recent Orders
                    </h2>
                    <Link to="/orders" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1">
                      View All <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-gray-100"
                      >
                        <img
                          src={order.image}
                          alt="Order"
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {order.items} item(s) • {new Date(order.date).toLocaleDateString()}
                          </p>
                          <p className="text-lg font-bold text-purple-600">₹{order.total}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Wishlist */}
                <div className="dashboard-card bg-white rounded-3xl shadow-xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Heart className="w-6 h-6 text-red-500" />
                      Your Wishlist
                    </h2>
                    <Link to="/products" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1">
                      Browse More <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                          <h3 className="font-bold text-white mb-1">{item.name}</h3>
                          <p className="text-yellow-300 font-bold">₹{item.price}</p>
                        </div>
                        <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:scale-110 transition-all">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card grid md:grid-cols-3 gap-6">
                  {[
                    { icon: Eye, title: 'Virtual Try-On', desc: 'Try glasses virtually', color: 'from-purple-500 to-pink-500', link: '/virtual-tryon' },
                    { icon: ShoppingBag, title: 'Shop Now', desc: 'Browse collection', color: 'from-blue-500 to-cyan-500', link: '/products' },
                    { icon: Award, title: 'Rewards', desc: 'Redeem points', color: 'from-green-500 to-emerald-500', link: '#' },
                  ].map((action, idx) => (
                    <Link
                      key={idx}
                      to={action.link}
                      className="bg-white rounded-3xl p-8 text-center shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group"
                    >
                      <div className={`bg-gradient-to-br ${action.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-gray-600">{action.desc}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="dashboard-card bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2>
                <p className="text-gray-600">Order history will be displayed here</p>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="dashboard-card bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="+91 xxxxx xxxxx"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    />
                  </div>
                  <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Other tabs content can be added similarly */}
            {!['overview', 'orders', 'profile'].includes(activeTab) && (
              <div className="dashboard-card bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab.replace('-', ' ')}</h2>
                <p className="text-gray-600">Content for {activeTab} will be displayed here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
