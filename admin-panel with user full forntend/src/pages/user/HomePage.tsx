import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Star, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
import { storeProducts } from '../../data/storeProducts';
import { useCart } from '../../contexts/CartContext';

interface HomePageProps {
  onNavigate: (page: string, data?: Record<string, unknown>) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const featuredProducts = storeProducts.filter(p => p.isBestseller).slice(0, 4);
  const newArrivals = storeProducts.filter(p => p.isNew).slice(0, 4);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-content',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      
      gsap.fromTo('.hero-image',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: 'power3.out' }
      );
      
      gsap.fromTo('.category-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.4, ease: 'back.out(1.2)' }
      );
      
      gsap.fromTo('.product-card',
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, delay: 0.6, ease: 'back.out(1.2)' }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleAddToCart = (product: typeof storeProducts[0]) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      brand: product.brand,
      frameType: product.frameType,
      lensType: product.lensType
    });
  };

  return (
    <div ref={containerRef}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hero-content">
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-4">
                ✨ New Collection 2024
              </span>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                See the World in <span className="text-yellow-300">Perfect Style</span>
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Discover premium eyewear that combines fashion with function. From trendy eyeglasses to designer sunglasses.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => onNavigate('products')}
                  className="px-8 py-4 bg-white text-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => onNavigate('eyeglasses')}
                  className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
                >
                  Browse Eyeglasses
                </button>
              </div>
            </div>
            <div className="hero-image flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-[150px]">👓</span>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-2xl flex items-center justify-center text-4xl rotate-12 shadow-lg">
                  🕶️
                </div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-pink-400 rounded-2xl flex items-center justify-center text-3xl -rotate-12 shadow-lg">
                  👁️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Truck className="w-6 h-6" />, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: <Shield className="w-6 h-6" />, title: '2 Year Warranty', desc: 'On all products' },
              { icon: <RefreshCw className="w-6 h-6" />, title: '30-Day Returns', desc: 'Easy returns' },
              { icon: <Headphones className="w-6 h-6" />, title: '24/7 Support', desc: 'Expert help' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-4 p-4">
                <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                  {feature.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{feature.title}</p>
                  <p className="text-sm text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect eyewear for every occasion</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Eyeglasses', icon: '👓', desc: 'Prescription & Fashion', page: 'eyeglasses', color: 'from-blue-500 to-cyan-500' },
              { name: 'Sunglasses', icon: '🕶️', desc: 'UV Protection & Style', page: 'sunglasses', color: 'from-orange-500 to-pink-500' },
              { name: 'Contact Lenses', icon: '👁️', desc: 'Daily & Monthly', page: 'contacts', color: 'from-green-500 to-teal-500' }
            ].map((category, index) => (
              <button
                key={index}
                onClick={() => onNavigate(category.page)}
                className={`category-card bg-gradient-to-br ${category.color} rounded-2xl p-8 text-white text-left hover:scale-105 transition-transform duration-300 shadow-lg`}
              >
                <span className="text-6xl block mb-4">{category.icon}</span>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-white/80">{category.desc}</p>
                <div className="flex items-center gap-2 mt-4 font-medium">
                  Shop Now <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Bestsellers</h2>
              <p className="text-gray-600">Our most popular products</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="hidden sm:flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700"
            >
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-7xl text-center py-4">{product.image}</div>
                  {product.discount && (
                    <span className="absolute top-4 left-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      -{product.discount}%
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Bestseller
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm text-violet-600 font-medium">{product.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 lg:p-12 text-white text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get 20% Off Your First Order</h2>
            <p className="text-white/80 mb-6 max-w-lg mx-auto">
              Sign up for our newsletter and receive exclusive offers, new arrival updates, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-violet-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
              <p className="text-gray-600">The latest additions to our collection</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="hidden sm:flex items-center gap-2 text-violet-600 font-medium hover:text-violet-700"
            >
              View All <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <div
                key={product.id}
                className="product-card bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="relative p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-7xl text-center py-4">{product.image}</div>
                  <span className="absolute top-4 left-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-sm text-violet-600 font-medium">{product.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                    <span className="text-gray-400 text-sm">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
