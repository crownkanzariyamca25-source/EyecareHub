// Products Data
const products = [
    {
        id: '1',
        name: 'Classic Aviator Gold',
        category: 'sunglasses',
        brand: 'RayBan',
        frameType: 'Metal',
        lensType: 'Polarized',
        price: 89.99,
        discount: 20,
        images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80'],
        description: 'Timeless aviator sunglasses with premium gold frame and polarized lenses for ultimate sun protection.',
        features: ['UV Protection', '100% Polarized', 'Scratch Resistant', 'Lightweight'],
        inStock: true,
        rating: 4.5,
        reviews: 328
    },
    {
        id: '2',
        name: 'Modern Rectangle Frame',
        category: 'eyeglasses',
        brand: 'Oakley',
        frameType: 'Acetate',
        lensType: 'Blue Light Filter',
        price: 59.99,
        discount: 15,
        images: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500&q=80'],
        description: 'Contemporary rectangle eyeglasses with blue light filtering lenses, perfect for digital screen usage.',
        features: ['Blue Light Protection', 'Anti-Glare', 'Lightweight', 'Durable'],
        inStock: true,
        rating: 4.8,
        reviews: 512
    },
    {
        id: '3',
        name: 'Round Vintage Sunglasses',
        category: 'sunglasses',
        brand: 'Prada',
        frameType: 'Acetate',
        lensType: 'Gradient',
        price: 129.99,
        discount: 25,
        images: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500&q=80'],
        description: 'Stylish round frame sunglasses with gradient lenses for a vintage-inspired look.',
        features: ['UV400 Protection', 'Gradient Lenses', 'Premium Acetate', 'Fashion Forward'],
        inStock: true,
        rating: 4.6,
        reviews: 234
    },
    {
        id: '4',
        name: 'Cat Eye Fashion Glasses',
        category: 'eyeglasses',
        brand: 'Gucci',
        frameType: 'Acetate',
        lensType: 'Clear',
        price: 149.99,
        discount: 10,
        images: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=500&q=80'],
        description: 'Elegant cat eye glasses that combine vintage charm with modern sophistication.',
        features: ['Designer Frame', 'Comfortable Fit', 'Prescription Ready', 'Stylish'],
        inStock: true,
        rating: 4.7,
        reviews: 189
    },
    {
        id: '5',
        name: 'Sports Performance Sunglasses',
        category: 'sunglasses',
        brand: 'Nike',
        frameType: 'Plastic',
        lensType: 'Mirrored',
        price: 79.99,
        discount: 15,
        images: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500&q=80'],
        description: 'High-performance sports sunglasses designed for active lifestyles and outdoor adventures.',
        features: ['Impact Resistant', 'Non-Slip', 'UV Protection', 'Wraparound Design'],
        inStock: true,
        rating: 4.4,
        reviews: 276
    },
    {
        id: '6',
        name: 'Classic Wayfarer Black',
        category: 'sunglasses',
        brand: 'RayBan',
        frameType: 'Acetate',
        lensType: 'Polarized',
        price: 99.99,
        discount: 20,
        images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80'],
        description: 'Iconic wayfarer design in classic black. A timeless style that never goes out of fashion.',
        features: ['100% UV Protection', 'Polarized', 'Durable Frame', 'Iconic Design'],
        inStock: true,
        rating: 4.9,
        reviews: 892
    },
    {
        id: '7',
        name: 'Blue Light Blocking Glasses',
        category: 'eyeglasses',
        brand: 'Felix Gray',
        frameType: 'Metal',
        lensType: 'Blue Light Filter',
        price: 69.99,
        discount: 25,
        images: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500&q=80'],
        description: 'Advanced blue light blocking technology to reduce eye strain from digital devices.',
        features: ['Blue Light Filter', 'Anti-Reflective', 'Clear Lenses', 'All-Day Comfort'],
        inStock: true,
        rating: 4.6,
        reviews: 445
    },
    {
        id: '8',
        name: 'Luxury Pilot Sunglasses',
        category: 'sunglasses',
        brand: 'Tom Ford',
        frameType: 'Metal',
        lensType: 'Gradient',
        price: 199.99,
        discount: 15,
        images: ['https://images.unsplash.com/photo-1583099645256-70eb52f48e3c?w=500&q=80'],
        description: 'Premium pilot-style sunglasses with designer details and superior lens quality.',
        features: ['Designer Brand', 'UV400', 'Gradient Lenses', 'Premium Materials'],
        inStock: true,
        rating: 4.8,
        reviews: 156
    }
];

const categories = [
    {
        id: 'eyeglasses',
        name: 'Eyeglasses',
        icon: '👓',
        description: 'Prescription and fashion eyeglasses for everyday wear'
    },
    {
        id: 'sunglasses',
        name: 'Sunglasses',
        icon: '🕶️',
        description: 'UV protection sunglasses for outdoor activities'
    },
    {
        id: 'contact-lenses',
        name: 'Contact Lenses',
        icon: '👁️',
        description: 'Daily, weekly and monthly contact lenses'
    }
];

function getFinalPrice(product) {
    return (product.price * (1 - product.discount / 100)).toFixed(2);
}

function formatPrice(price) {
    return `₹${parseFloat(price).toFixed(2)}`;
}
