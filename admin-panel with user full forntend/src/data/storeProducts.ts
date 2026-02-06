export interface StoreProduct {
  id: string;
  name: string;
  category: 'Eyeglasses' | 'Sunglasses' | 'Contact Lenses';
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images: string[];
  description: string;
  features: string[];
  frameType?: 'Full Rim' | 'Half Rim' | 'Rimless';
  lensType?: 'Single Vision' | 'Bifocal' | 'Progressive' | 'Blue Light' | 'Polarized' | 'UV Protection';
  material?: string;
  color: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

export const storeProducts: StoreProduct[] = [
  // Eyeglasses
  {
    id: 'EG001',
    name: 'Classic Round Eyeglasses',
    category: 'Eyeglasses',
    brand: 'Ray-Ban',
    price: 149.99,
    originalPrice: 189.99,
    discount: 21,
    image: '👓',
    images: ['👓', '👓', '👓'],
    description: 'Timeless round frame eyeglasses with blue light filter technology. Perfect for everyday wear and screen time protection.',
    features: ['Blue Light Filter', 'Anti-Reflective Coating', 'Scratch Resistant', 'UV Protection'],
    frameType: 'Full Rim',
    lensType: 'Blue Light',
    material: 'Acetate',
    color: 'Black',
    rating: 4.8,
    reviews: 256,
    stock: 45,
    isBestseller: true
  },
  {
    id: 'EG002',
    name: 'Cat Eye Fashion Frames',
    category: 'Eyeglasses',
    brand: 'Vogue',
    price: 179.99,
    image: '👓',
    images: ['👓', '👓', '👓'],
    description: 'Elegant cat eye frames designed for the modern woman. Combines vintage charm with contemporary style.',
    features: ['Lightweight Design', 'Spring Hinges', 'Premium Acetate', 'Adjustable Nose Pads'],
    frameType: 'Full Rim',
    lensType: 'Single Vision',
    material: 'Acetate',
    color: 'Tortoise',
    rating: 4.6,
    reviews: 189,
    stock: 30,
    isNew: true
  },
  {
    id: 'EG003',
    name: 'Titanium Rectangle Frames',
    category: 'Eyeglasses',
    brand: 'Oakley',
    price: 229.99,
    originalPrice: 279.99,
    discount: 18,
    image: '👓',
    images: ['👓', '👓', '👓'],
    description: 'Ultra-lightweight titanium frames with a sleek rectangular design. Built for durability and all-day comfort.',
    features: ['Titanium Frame', 'Hypoallergenic', 'Flexible Temples', 'Memory Metal'],
    frameType: 'Half Rim',
    lensType: 'Progressive',
    material: 'Titanium',
    color: 'Gunmetal',
    rating: 4.9,
    reviews: 312,
    stock: 25,
    isBestseller: true
  },
  {
    id: 'EG004',
    name: 'Vintage Aviator Glasses',
    category: 'Eyeglasses',
    brand: 'Ray-Ban',
    price: 169.99,
    image: '👓',
    images: ['👓', '👓', '👓'],
    description: 'Classic aviator-style eyeglasses with a modern twist. Features adjustable nose pads for a perfect fit.',
    features: ['Double Bridge', 'Adjustable Nose Pads', 'Temple Tips', 'Premium Lenses'],
    frameType: 'Full Rim',
    lensType: 'Single Vision',
    material: 'Metal',
    color: 'Gold',
    rating: 4.7,
    reviews: 145,
    stock: 38
  },
  {
    id: 'EG005',
    name: 'Minimalist Rimless Glasses',
    category: 'Eyeglasses',
    brand: 'Silhouette',
    price: 299.99,
    image: '👓',
    images: ['👓', '👓', '👓'],
    description: 'Featherweight rimless design for those who prefer an understated look. Virtually invisible on the face.',
    features: ['Ultra Lightweight', 'Rimless Design', 'Titanium Temples', 'Customizable'],
    frameType: 'Rimless',
    lensType: 'Bifocal',
    material: 'Titanium',
    color: 'Silver',
    rating: 4.5,
    reviews: 98,
    stock: 15,
    isNew: true
  },
  
  // Sunglasses
  {
    id: 'SG001',
    name: 'Aviator Polarized Sunglasses',
    category: 'Sunglasses',
    brand: 'Ray-Ban',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    image: '🕶️',
    images: ['🕶️', '🕶️', '🕶️'],
    description: 'Iconic aviator sunglasses with premium polarized lenses. Offers 100% UV protection and reduces glare.',
    features: ['Polarized Lenses', '100% UV Protection', 'Anti-Glare', 'Mirrored Coating'],
    lensType: 'Polarized',
    material: 'Metal',
    color: 'Gold/Green',
    rating: 4.9,
    reviews: 567,
    stock: 60,
    isBestseller: true
  },
  {
    id: 'SG002',
    name: 'Sport Performance Sunglasses',
    category: 'Sunglasses',
    brand: 'Oakley',
    price: 179.99,
    image: '🕶️',
    images: ['🕶️', '🕶️', '🕶️'],
    description: 'High-performance sports sunglasses designed for athletes. Wraparound design provides maximum coverage.',
    features: ['Impact Resistant', 'Hydrophobic Coating', 'Non-Slip Grip', 'Ventilated Lenses'],
    lensType: 'UV Protection',
    material: 'O-Matter',
    color: 'Matte Black',
    rating: 4.8,
    reviews: 423,
    stock: 55
  },
  {
    id: 'SG003',
    name: 'Oversized Fashion Sunglasses',
    category: 'Sunglasses',
    brand: 'Gucci',
    price: 349.99,
    image: '🕶️',
    images: ['🕶️', '🕶️', '🕶️'],
    description: 'Luxurious oversized sunglasses with iconic branding. A bold fashion statement for the style-conscious.',
    features: ['Designer Brand', 'Gradient Lenses', 'UV400 Protection', 'Luxury Case Included'],
    lensType: 'UV Protection',
    material: 'Acetate',
    color: 'Havana Brown',
    rating: 4.7,
    reviews: 234,
    stock: 20,
    isNew: true
  },
  {
    id: 'SG004',
    name: 'Wayfarer Classic Sunglasses',
    category: 'Sunglasses',
    brand: 'Ray-Ban',
    price: 159.99,
    image: '🕶️',
    images: ['🕶️', '🕶️', '🕶️'],
    description: 'The timeless Wayfarer design that never goes out of style. Perfect for any face shape and occasion.',
    features: ['Classic Design', 'Durable Hinges', 'UV Protection', 'Lightweight'],
    lensType: 'UV Protection',
    material: 'Acetate',
    color: 'Black',
    rating: 4.8,
    reviews: 789,
    stock: 75,
    isBestseller: true
  },
  {
    id: 'SG005',
    name: 'Round Retro Sunglasses',
    category: 'Sunglasses',
    brand: 'Persol',
    price: 289.99,
    originalPrice: 329.99,
    discount: 12,
    image: '🕶️',
    images: ['🕶️', '🕶️', '🕶️'],
    description: 'Vintage-inspired round sunglasses with crystal lenses. Italian craftsmanship at its finest.',
    features: ['Crystal Lenses', 'Meflecto System', 'Hand-Finished', 'Supreme Arrow'],
    lensType: 'Polarized',
    material: 'Acetate',
    color: 'Terra di Siena',
    rating: 4.6,
    reviews: 167,
    stock: 28
  },
  
  // Contact Lenses
  {
    id: 'CL001',
    name: 'Daily Disposable Lenses',
    category: 'Contact Lenses',
    brand: 'Acuvue',
    price: 49.99,
    originalPrice: 59.99,
    discount: 17,
    image: '👁️',
    images: ['👁️', '👁️', '👁️'],
    description: 'Comfortable daily disposable contact lenses with HydraLuxe technology. Fresh pair every day for optimal hygiene.',
    features: ['HydraLuxe Technology', 'UV Blocking', 'Daily Disposal', '30-Pack'],
    lensType: 'Single Vision',
    material: 'Silicone Hydrogel',
    color: 'Clear',
    rating: 4.7,
    reviews: 1234,
    stock: 200,
    isBestseller: true
  },
  {
    id: 'CL002',
    name: 'Monthly Extended Wear',
    category: 'Contact Lenses',
    brand: 'Air Optix',
    price: 39.99,
    image: '👁️',
    images: ['👁️', '👁️', '👁️'],
    description: 'Breathable monthly lenses designed for extended wear. SmartShield technology resists deposits.',
    features: ['SmartShield Technology', 'High Oxygen', 'Monthly Replacement', '6-Pack'],
    lensType: 'Single Vision',
    material: 'Lotrafilcon B',
    color: 'Clear',
    rating: 4.5,
    reviews: 567,
    stock: 150
  },
  {
    id: 'CL003',
    name: 'Color Enhancement Lenses',
    category: 'Contact Lenses',
    brand: 'FreshLook',
    price: 29.99,
    image: '👁️',
    images: ['👁️', '👁️', '👁️'],
    description: 'Natural-looking color contact lenses that enhance your eye color. Available in multiple shades.',
    features: ['3-in-1 Color Technology', 'Natural Look', 'Monthly Wear', '2-Pack'],
    lensType: 'Single Vision',
    material: 'Phemfilcon A',
    color: 'Honey',
    rating: 4.4,
    reviews: 345,
    stock: 100,
    isNew: true
  },
  {
    id: 'CL004',
    name: 'Astigmatism Correction Lenses',
    category: 'Contact Lenses',
    brand: 'Acuvue',
    price: 59.99,
    image: '👁️',
    images: ['👁️', '👁️', '👁️'],
    description: 'Toric lenses specially designed for astigmatism correction. Blink Stabilized design for clear vision.',
    features: ['Blink Stabilized', 'Toric Design', 'Daily Disposal', '30-Pack'],
    lensType: 'Single Vision',
    material: 'Silicone Hydrogel',
    color: 'Clear',
    rating: 4.6,
    reviews: 289,
    stock: 80
  },
  {
    id: 'CL005',
    name: 'Multifocal Daily Lenses',
    category: 'Contact Lenses',
    brand: 'Dailies',
    price: 69.99,
    originalPrice: 79.99,
    discount: 13,
    image: '👁️',
    images: ['👁️', '👁️', '👁️'],
    description: 'Progressive contact lenses for presbyopia. Water gradient technology for exceptional comfort.',
    features: ['Water Gradient', 'Multifocal Design', 'Daily Disposal', '30-Pack'],
    lensType: 'Progressive',
    material: 'Delefilcon A',
    color: 'Clear',
    rating: 4.5,
    reviews: 178,
    stock: 65,
    isBestseller: true
  }
];

export const brands = ['Ray-Ban', 'Oakley', 'Vogue', 'Gucci', 'Silhouette', 'Persol', 'Acuvue', 'Air Optix', 'FreshLook', 'Dailies'];
export const frameTypes = ['Full Rim', 'Half Rim', 'Rimless'];
export const lensTypes = ['Single Vision', 'Bifocal', 'Progressive', 'Blue Light', 'Polarized', 'UV Protection'];
