import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Clock,
  Search,
  X,
  Eye
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { monthlyRevenueData, mockOrders, mockUsers, mockProducts, mockCoupons } from '../data/mockData';

const recentActivity = [
  { type: 'order', message: 'New eyeglasses order #ORD-006 received', time: '2 min ago', icon: <Package className="w-4 h-4" /> },
  { type: 'user', message: 'New customer registration', time: '15 min ago', icon: <Users className="w-4 h-4" /> },
  { type: 'order', message: 'Sunglasses order #ORD-003 shipped', time: '1 hour ago', icon: <ShoppingCart className="w-4 h-4" /> },
  { type: 'sale', message: 'Contact lenses bulk order - $299', time: '2 hours ago', icon: <DollarSign className="w-4 h-4" /> },
];

interface SearchResult {
  type: 'order' | 'user' | 'product' | 'coupon';
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<(HTMLDivElement | null)[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Calculate real stats from data
  const stats = useMemo(() => {
    const totalSales = mockOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockOrders.length;
    const totalUsers = mockUsers.length;
    const monthlyRevenue = monthlyRevenueData[monthlyRevenueData.length - 1].revenue;

    return [
      { 
        title: 'Total Sales', 
        value: `$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, 
        change: '+12.5%', 
        isPositive: true, 
        icon: <DollarSign className="w-6 h-6" />,
        color: 'from-emerald-500 to-green-600',
        bgColor: 'bg-emerald-50',
        textColor: 'text-emerald-600'
      },
      { 
        title: 'Total Orders', 
        value: totalOrders.toString(), 
        change: '+8.2%', 
        isPositive: true, 
        icon: <ShoppingCart className="w-6 h-6" />,
        color: 'from-blue-500 to-cyan-600',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600'
      },
      { 
        title: 'Total Users', 
        value: totalUsers.toString(), 
        change: '+23.1%', 
        isPositive: true, 
        icon: <Users className="w-6 h-6" />,
        color: 'from-violet-500 to-purple-600',
        bgColor: 'bg-violet-50',
        textColor: 'text-violet-600'
      },
      { 
        title: 'Monthly Revenue', 
        value: `$${monthlyRevenue.toLocaleString()}`, 
        change: '+15.3%', 
        isPositive: true, 
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'from-orange-500 to-amber-600',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-600'
      },
    ];
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(statsRef.current,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.2)' }
      );

      gsap.fromTo('.chart-container',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, delay: 0.4, ease: 'power3.out' }
      );

      gsap.fromTo('.activity-item',
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.6, ease: 'power2.out' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search Orders
    mockOrders.forEach(order => {
      if (
        order.id.toLowerCase().includes(term) ||
        order.customer.toLowerCase().includes(term) ||
        order.email.toLowerCase().includes(term) ||
        order.products.some(p => p.toLowerCase().includes(term))
      ) {
        results.push({
          type: 'order',
          id: order.id,
          title: `Order ${order.id}`,
          subtitle: `${order.customer} - $${order.total.toFixed(2)} - ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`,
          icon: <ShoppingCart className="w-4 h-4" />
        });
      }
    });

    // Search Users
    mockUsers.forEach(user => {
      if (
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'user',
          id: user.id,
          title: user.name,
          subtitle: `${user.email} - ${user.role.charAt(0).toUpperCase() + user.role.slice(1)} - ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}`,
          icon: <Users className="w-4 h-4" />
        });
      }
    });

    // Search Products
    mockProducts.forEach(product => {
      if (
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'product',
          id: product.id,
          title: product.name,
          subtitle: `${product.category} - $${product.price.toFixed(2)} - ${product.stock} in stock`,
          icon: <Package className="w-4 h-4" />
        });
      }
    });

    // Search Coupons
    mockCoupons.forEach(coupon => {
      if (
        coupon.code.toLowerCase().includes(term) ||
        coupon.type.toLowerCase().includes(term)
      ) {
        results.push({
          type: 'coupon',
          id: coupon.id,
          title: coupon.code,
          subtitle: `${coupon.type === 'percentage' ? coupon.discount + '%' : '$' + coupon.discount} off - ${coupon.status.charAt(0).toUpperCase() + coupon.status.slice(1)}`,
          icon: <DollarSign className="w-4 h-4" />
        });
      }
    });

    setSearchResults(results.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(true);
  }, [searchTerm]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
    setShowSearchResults(false);
    setSearchTerm('');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'user': return 'bg-violet-100 text-violet-600';
      case 'product': return 'bg-emerald-100 text-emerald-600';
      case 'coupon': return 'bg-amber-100 text-amber-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div ref={containerRef} className="p-4 lg:p-8 space-y-6 lg:space-y-8">
      {/* Search Bar */}
      <div ref={searchRef} className="relative max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, users, products, coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchResults(true)}
            className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
          />
          {searchTerm && (
            <button 
              onClick={() => { setSearchTerm(''); setSearchResults([]); setShowSearchResults(false); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs text-gray-400 px-3 py-2 font-medium uppercase">
                {searchResults.length} Result{searchResults.length !== 1 ? 's' : ''} Found
              </p>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}-${index}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 rounded-lg transition-colors text-left"
                >
                  <div className={`p-2 rounded-lg ${getTypeColor(result.type)}`}>
                    {result.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{result.title}</p>
                    <p className="text-sm text-gray-500 truncate">{result.subtitle}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(result.type)}`}>
                    {result.type}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {showSearchResults && searchTerm.length >= 2 && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No results found for "{searchTerm}"</p>
            <p className="text-sm text-gray-400 mt-1">Try different keywords</p>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            ref={(el) => { statsRef.current[index] = el; }}
            className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Revenue Chart */}
        <div className="chart-container xl:col-span-2 bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
              <p className="text-gray-500 text-sm">Monthly revenue for 2024</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 lg:px-4 py-2 bg-violet-100 text-violet-600 rounded-lg text-sm font-medium">Revenue</button>
              <button className="px-3 lg:px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors">Orders</button>
            </div>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="chart-container bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900">Orders by Month</h3>
            <p className="text-gray-500 text-sm">Order volume trends</p>
          </div>
          <div className="h-64 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueData.slice(-6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <button className="text-violet-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-4 font-medium">Order ID</th>
                  <th className="pb-4 font-medium">Customer</th>
                  <th className="pb-4 font-medium">Total</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockOrders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="text-sm">
                    <td className="py-4 font-medium text-gray-900">{order.id}</td>
                    <td className="py-4 text-gray-600">{order.customer}</td>
                    <td className="py-4 font-semibold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'processing' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'pending' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <button className="text-violet-600 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium text-sm">{activity.message}</p>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedResult(null)}>
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <span className={`p-2 rounded-lg ${getTypeColor(selectedResult.type)}`}>
                  {selectedResult.icon}
                </span>
                {selectedResult.type.charAt(0).toUpperCase() + selectedResult.type.slice(1)} Details
              </h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Title</p>
                <p className="font-semibold text-gray-900 text-lg">{selectedResult.title}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Details</p>
                <p className="text-gray-700">{selectedResult.subtitle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(selectedResult.type)}`}>
                  {selectedResult.type.charAt(0).toUpperCase() + selectedResult.type.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setSelectedResult(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setSelectedResult(null)}
                className="flex-1 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-medium hover:from-violet-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
