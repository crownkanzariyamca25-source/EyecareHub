// Mock Data
const mockData = {
    users: [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', avatar: 'JD', joinedDate: '2024-01-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', avatar: 'JS', joinedDate: '2024-02-20' },
        { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'blocked', avatar: 'MJ', joinedDate: '2024-03-10' },
        { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'admin', status: 'active', avatar: 'SW', joinedDate: '2024-01-05' },
        { id: '5', name: 'Tom Brown', email: 'tom@example.com', role: 'user', status: 'active', avatar: 'TB', joinedDate: '2024-04-12' },
    ],

    products: [
        { id: '1', name: 'Classic Round Eyeglasses', category: 'Eyeglasses', price: 149.99, stock: 45, image: '👓', description: 'Classic round frame eyeglasses with blue light filter' },
        { id: '2', name: 'Aviator Sunglasses', category: 'Sunglasses', price: 199.99, stock: 30, image: '🕶️', description: 'Premium polarized aviator sunglasses' },
        { id: '3', name: 'Daily Contact Lenses', category: 'Contact Lenses', price: 89.99, stock: 100, image: '👁️', description: 'Daily disposable contact lenses - 30 pack' },
        { id: '4', name: 'Cat Eye Eyeglasses', category: 'Eyeglasses', price: 179.99, stock: 25, image: '👓', description: 'Stylish cat eye frame for women' },
        { id: '5', name: 'Sports Sunglasses', category: 'Sunglasses', price: 129.99, stock: 60, image: '🕶️', description: 'UV protection sports sunglasses' },
        { id: '6', name: 'Monthly Contact Lenses', category: 'Contact Lenses', price: 59.99, stock: 80, image: '👁️', description: 'Monthly wear contact lenses - 6 pack' },
    ],

    categories: [
        { id: '1', name: 'Eyeglasses', description: 'Prescription and fashion eyeglasses for everyday wear', productCount: 45, icon: '👓' },
        { id: '2', name: 'Sunglasses', description: 'UV protection sunglasses for outdoor activities', productCount: 32, icon: '🕶️' },
        { id: '3', name: 'Contact Lenses', description: 'Daily, weekly and monthly contact lenses', productCount: 28, icon: '👁️' },
    ],

    orders: [
        { id: 'ORD-001', customer: 'John Doe', email: 'john@example.com', products: ['Classic Round Eyeglasses', 'Aviator Sunglasses'], total: 349.98, status: 'delivered', date: '2024-01-20' },
        { id: 'ORD-002', customer: 'Jane Smith', email: 'jane@example.com', products: ['Sports Sunglasses'], total: 129.99, status: 'shipped', date: '2024-01-22' },
        { id: 'ORD-003', customer: 'Mike Johnson', email: 'mike@example.com', products: ['Daily Contact Lenses', 'Cat Eye Eyeglasses'], total: 269.98, status: 'processing', date: '2024-01-23' },
        { id: 'ORD-004', customer: 'Sarah Wilson', email: 'sarah@example.com', products: ['Monthly Contact Lenses'], total: 59.99, status: 'pending', date: '2024-01-24' },
        { id: 'ORD-005', customer: 'Tom Brown', email: 'tom@example.com', products: ['Classic Round Eyeglasses'], total: 149.99, status: 'cancelled', date: '2024-01-25' },
    ],

    coupons: [
        { id: '1', code: 'WELCOME20', discount: 20, type: 'percentage', minOrder: 50, expiryDate: '2024-12-31', status: 'active', usageCount: 150, usageLimit: 500 },
        { id: '2', code: 'FLAT10', discount: 10, type: 'fixed', minOrder: 30, expiryDate: '2024-06-30', status: 'active', usageCount: 89, usageLimit: 200 },
        { id: '3', code: 'SUMMER25', discount: 25, type: 'percentage', minOrder: 100, expiryDate: '2024-08-31', status: 'active', usageCount: 45, usageLimit: 100 },
        { id: '4', code: 'FLASH50', discount: 50, type: 'percentage', minOrder: 200, expiryDate: '2024-01-15', status: 'expired', usageCount: 100, usageLimit: 100 },
        { id: '5', code: 'VIP15', discount: 15, type: 'fixed', minOrder: 25, expiryDate: '2024-12-31', status: 'disabled', usageCount: 30, usageLimit: 50 },
    ],

    monthlyRevenue: [
        { month: 'Jan', revenue: 12500, orders: 145 },
        { month: 'Feb', revenue: 18200, orders: 198 },
        { month: 'Mar', revenue: 15800, orders: 176 },
        { month: 'Apr', revenue: 21500, orders: 234 },
        { month: 'May', revenue: 19200, orders: 201 },
        { month: 'Jun', revenue: 24800, orders: 267 },
    ]
};

// Stats calculation
function getStats() {
    const totalRevenue = mockData.orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = mockData.orders.length;
    const totalUsers = mockData.users.length;
    const totalProducts = mockData.products.length;
    
    return {
        revenue: totalRevenue.toFixed(2),
        orders: totalOrders,
        users: totalUsers,
        products: totalProducts
    };
}
