import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, ShoppingCart, Star, X, SlidersHorizontal, ChevronDown, TrendingUp, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  colors: string[];
  trending?: boolean;
  discount?: number;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Classic Aviator Gold',
    price: 2999,
    originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500',
    category: 'Sunglasses',
    brand: 'Ray-Ban',
    rating: 4.8,
    reviews: 2543,
    colors: ['gold', 'silver', 'black'],
    trending: true,
    discount: 40
  },
  {
    id: 2,
    name: 'Round Vintage Frame',
    price: 1999,
    originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500',
    category: 'Eyeglasses',
    brand: 'Oakley',
    rating: 4.9,
    reviews: 3201,
    colors: ['brown', 'black', 'tortoise'],
    trending: true,
    discount: 43
  },
  {
    id: 3,
    name: 'Cat Eye Glam Style',
    price: 2499,
    originalPrice: 4299,
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=500',
    category: 'Sunglasses',
    brand: 'Prada',
    rating: 4.7,
    reviews: 1876,
    colors: ['pink', 'black', 'white'],
    discount: 42
  },
  {
    id: 4,
    name: 'Sport Performance Wrap',
    price: 3499,
    originalPrice: 5999,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    category: 'Sunglasses',
    brand: 'Oakley',
    rating: 4.6,
    reviews: 1534,
    colors: ['blue', 'red', 'black'],
    trending: true,
    discount: 42
  },
  {
    id: 5,
    name: 'Rectangular Classic',
    price: 1799,
    originalPrice: 2999,
    image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=500',
    category: 'Eyeglasses',
    brand: 'Gucci',
    rating: 4.8,
    reviews: 2123,
    colors: ['black', 'brown', 'blue'],
    discount: 40
  },
  {
    id: 6,
    name: 'Oversized Chic Glamour',
    price: 2799,
    originalPrice: 4699,
    image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500',
    category: 'Sunglasses',
    brand: 'Versace',
    rating: 4.9,
    reviews: 2890,
    colors: ['black', 'brown', 'pink'],
    trending: true,
    discount: 40
  },
  {
    id: 7,
    name: 'Wayfarer Classic Black',
    price: 2299,
    originalPrice: 3799,
    image: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=500',
    category: 'Sunglasses',
    brand: 'Ray-Ban',
    rating: 4.8,
    reviews: 3421,
    colors: ['black', 'tortoise', 'blue'],
    discount: 40
  },
  {
    id: 8,
    name: 'Square Metal Frame',
    price: 2199,
    originalPrice: 3599,
    image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500',
    category: 'Eyeglasses',
    brand: 'Prada',
    rating: 4.7,
    reviews: 1654,
    colors: ['silver', 'gold', 'black'],
    discount: 39
  },
  {
    id: 9,
    name: 'Retro Colorful Lens',
    price: 1899,
    originalPrice: 3199,
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c96b0?w=500',
    category: 'Sunglasses',
    brand: 'Oakley',
    rating: 4.6,
    reviews: 987,
    colors: ['multicolor', 'black', 'white'],
    discount: 41
  },
];

const categories = ['All', 'Eyeglasses', 'Sunglasses', 'Contact Lenses'];
const brands = ['All', 'Ray-Ban', 'Oakley', 'Prada', 'Gucci', 'Versace'];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];

export default function EnhancedProducts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const { addToCart } = useCart();
  const productsRef = useRef(null);

  useEffect(() => {
    // Animations
    gsap.from('.product-card-enhanced', {
      scrollTrigger: {
        trigger: productsRef.current,
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.filter-section', {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power3.out'
    });

    gsap.from('.products-header', {
      opacity: 0,
      y: -50,
      duration: 0.8,
      ease: 'power3.out'
    });
  }, [selectedCategory, selectedBrand, sortBy]);

  const toggleFavorite = (productId: number) => {
    setFavorites(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="products-header bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Discover Your Style</h1>
          <p className="text-xl text-purple-100 mb-8">Explore our premium collection of eyewear</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for eyeglasses, sunglasses, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 shadow-2xl"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-purple-600 shadow-lg scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className={`filter-section ${showFilters ? 'block' : 'hidden lg:block'} lg:w-80 flex-shrink-0`}>
            <div className="sticky top-24 bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <SlidersHorizontal className="w-6 h-6 text-purple-600" />
                  Filters
                </h2>
                <button
                  onClick={() => setShowFilters(false)}
                  className="lg:hidden text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={selectedBrand === brand}
                        onChange={() => setSelectedBrand(brand)}
                        className="w-5 h-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="group-hover:text-purple-600 transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Price Range</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-purple-600"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>₹0</span>
                    <span className="font-bold text-purple-600">₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-gray-900">Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                      <div className="flex items-center gap-1">
                        {[...Array(rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-gray-300" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 group-hover:text-purple-600">& Up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSelectedBrand('All');
                  setPriceRange([0, 10000]);
                  setSearchQuery('');
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900">{sortedProducts.length}</span> products found
                </p>
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white pl-4 pr-10 py-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Products Grid */}
            <div ref={productsRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card-enhanced group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.trending && (
                        <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Trending
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            favorites.includes(product.id)
                              ? 'text-red-500 fill-current'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                      <Link
                        to="/virtual-tryon"
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all"
                      >
                        <Eye className="w-5 h-5 text-purple-600" />
                      </Link>
                    </div>

                    {/* Quick Add Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Quick Add
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                        {product.brand}
                      </span>
                      <span className="text-xs text-gray-500">{product.category}</span>
                    </div>

                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>

                    {/* Colors */}
                    <div className="flex gap-2 mb-4">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-purple-500 cursor-pointer transition-all hover:scale-110"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs text-gray-600">
                          +{product.colors.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-purple-600">₹{product.price}</span>
                          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-gray-100 hover:bg-purple-600 text-gray-700 hover:text-white p-3 rounded-full transition-all hover:scale-110"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">😔</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedBrand('All');
                    setPriceRange([0, 10000]);
                    setSearchQuery('');
                  }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
