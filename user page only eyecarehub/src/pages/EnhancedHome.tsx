import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Eye, ArrowRight, Zap, Check, Star, ChevronRight, Sparkles, Play } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  {
    id: 1,
    name: 'Eyeglasses',
    image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800',
    count: '500+ Styles',
    icon: '👓'
  },
  {
    id: 2,
    name: 'Sunglasses',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
    count: '400+ Styles',
    icon: '🕶️'
  },
  {
    id: 3,
    name: 'Contact Lenses',
    image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800',
    count: '200+ Options',
    icon: '👁️'
  },
  {
    id: 4,
    name: 'Kids Eyewear',
    image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800',
    count: '150+ Styles',
    icon: '✨'
  }
];

const trendingProducts = [
  { id: 1, name: 'Classic Aviator', price: 2999, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', rating: 4.8, sales: '2.5k' },
  { id: 2, name: 'Round Frame', price: 1999, image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400', rating: 4.9, sales: '3.2k' },
  { id: 3, name: 'Cat Eye Glam', price: 2499, image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', rating: 4.7, sales: '1.8k' },
  { id: 4, name: 'Sport Wrap', price: 3499, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', rating: 4.6, sales: '1.5k' },
  { id: 5, name: 'Vintage Square', price: 1799, image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400', rating: 4.8, sales: '2.1k' },
  { id: 6, name: 'Oversized Chic', price: 2799, image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400', rating: 4.9, sales: '2.8k' },
];

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Fashion Blogger',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    rating: 5,
    text: 'Amazing quality and fast delivery! The virtual try-on feature helped me choose the perfect frames. Highly recommended! 😍',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    role: 'Software Engineer',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    rating: 5,
    text: 'Best eyewear shopping experience ever! Great prices, excellent customer service, and the glasses are top-notch quality.',
  },
  {
    id: 3,
    name: 'Ananya Patel',
    role: 'Designer',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    rating: 5,
    text: 'Love the variety and style options! Found the perfect sunglasses that match my personality. Will definitely shop again! ✨',
  },
  {
    id: 4,
    name: 'Arjun Singh',
    role: 'Entrepreneur',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    rating: 5,
    text: 'Professional service and premium quality products. The home try-on service is a game changer! 🎯',
  },
];

const brands = [
  { name: 'Ray-Ban', logo: '🕶️' },
  { name: 'Oakley', logo: '👓' },
  { name: 'Prada', logo: '💎' },
  { name: 'Gucci', logo: '✨' },
  { name: 'Versace', logo: '👑' },
  { name: 'Carrera', logo: '🏎️' },
];

export default function EnhancedHome() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const heroRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    // Hero Animation
    gsap.fromTo('.hero-title',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
    );
    
    gsap.fromTo('.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-buttons',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.4, ease: 'power3.out' }
    );

    gsap.fromTo('.hero-image',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 1.2, delay: 0.3, ease: 'back.out(1.7)' }
    );

    // Scroll animations
    gsap.from('.category-card', {
      scrollTrigger: {
        trigger: '.categories-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
    });

    gsap.from('.product-card', {
      scrollTrigger: {
        trigger: '.products-section',
        start: 'top 80%',
      },
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.8,
    });

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden pt-20">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="text-white">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 py-2 bg-purple-500/30 border border-purple-400/50 rounded-full text-sm font-semibold text-purple-200 flex items-center gap-2 w-fit">
                  <Sparkles className="w-4 h-4" />
                  Premium Collection 2024
                </span>
              </div>

              <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
                Your Perfect
                <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Vision Awaits
                </span>
              </h1>

              <p className="hero-subtitle text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 text-gray-300 max-w-lg leading-relaxed">
                Discover premium eyewear that combines cutting-edge style with crystal-clear vision. Shop from thousands of designs handpicked for you.
              </p>

              <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12">
                <Link
                  to="/products"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/virtual-tryon"
                  className="group px-6 sm:px-8 py-3 sm:py-4 bg-white/10 border border-white/30 text-white rounded-lg font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>Try Virtual</span>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">1000+</div>
                  <div className="text-xs sm:text-sm text-gray-400">Eyewear Styles</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400">4.9★</div>
                  <div className="text-xs sm:text-sm text-gray-400">Avg Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="hero-image relative hidden lg:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&h=600&fit=crop"
                  alt="Premium Eyewear"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">4.9</div>
                      <div className="text-sm text-gray-600">50k Reviews</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-gray-900">
              Shop by Category
            </h2>
            <p className="text-base sm:text-lg text-gray-600">Explore our curated collections</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to="/products"
                className="category-card group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="aspect-square relative overflow-hidden bg-gray-200">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                  <div className="text-3xl sm:text-4xl mb-2">{cat.icon}</div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{cat.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-200 mb-3">{cat.count}</p>
                  <div className="flex items-center text-sm font-semibold">
                    Explore <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section py-16 sm:py-20 lg:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12 sm:mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Featured Collection
              </h2>
              <p className="text-base sm:text-lg text-gray-600">Handpicked eyewear for every style</p>
            </div>
            <Link
              to="/products"
              className="hidden sm:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingProducts.slice(0, 6).map((product) => (
              <div
                key={product.id}
                className="product-card group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all">
                    <Heart className="w-5 h-5 text-gray-700" />
                  </button>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                    Hot
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mb-3">
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
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                    <Link
                      to={`/products/${product.id}`}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg text-purple-100">Join 500,000+ happy customers</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-200 flex-shrink-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <div className="font-bold text-base sm:text-lg text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={prevTestimonial}
                  className="bg-purple-100 hover:bg-purple-200 p-2 sm:p-3 rounded-full transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 rotate-180" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        idx === currentTestimonial
                          ? 'bg-purple-600 w-6 sm:w-8'
                          : 'bg-purple-200 hover:bg-purple-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="bg-purple-100 hover:bg-purple-200 p-2 sm:p-3 rounded-full transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full filter blur-3xl opacity-10 -mr-48 -mt-48"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
            Ready to Find Your Perfect Frame?
          </h2>
          <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Try our advanced virtual try-on technology and see how glasses look on your face before you buy.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/virtual-tryon"
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-bold text-base sm:text-lg hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Try Virtual Try-On
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-white/10 border border-white/30 text-white rounded-lg font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs sm:text-sm font-semibold">New Collection 2024</span>
              </div>
              
              <h1 className="hero-title text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                See the World
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Differently
                </span>
              </h1>
              
              <p className="hero-subtitle text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 text-purple-100 leading-relaxed max-w-xl">
                Discover premium eyewear that combines style, comfort, and clarity. 
                Shop from 1000+ designs with virtual try-on technology.
              </p>
              
              <div className="hero-buttons flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
                <Link
                  to="/products"
                  className="group bg-white text-purple-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-yellow-300 transition-all duration-300 flex items-center justify-center gap-2 shadow-2xl hover:shadow-yellow-300/50 hover:scale-105"
                >
                  <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>Shop Now</span>
                </Link>
                <Link
                  to="/virtual-tryon"
                  className="group bg-purple-800/50 backdrop-blur-sm text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105"
                >
                  <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Virtual Try-On</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <span>100% Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-yellow-300 flex-shrink-0" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>

            <div className="hero-image relative order-1 lg:order-2">
              <div className="relative w-full max-w-md mx-auto lg:mx-0">
                <img
                  src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800"
                  alt="Featured Eyewear"
                  className="w-full rounded-2xl sm:rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-current" />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold text-gray-900">4.9</div>
                      <div className="text-xs sm:text-sm text-gray-600">50k+ Reviews</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 bg-yellow-400 rounded-lg sm:rounded-2xl p-3 sm:p-4 shadow-2xl animate-bounce">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">50% OFF</div>
                  <div className="text-xs text-gray-700">Limited Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-12 sm:py-16 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Users, value: '500K+', label: 'Happy Customers' },
              { icon: Eye, value: '1000+', label: 'Eyewear Styles' },
              { icon: Award, value: '50+', label: 'Brand Partners' },
              { icon: Globe, value: '100+', label: 'Cities Served' },
            ].map((stat, idx) => (
              <div key={idx} className="stat-card text-center text-white">
                <stat.icon className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-80" />
                <div className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Shop by Category
            </h2>
            <p className="text-base sm:text-xl text-gray-600">Find your perfect style</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to="/products"
                className="category-card group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className="aspect-square relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                </div>
                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 text-white">
                  <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 group-hover:scale-110 transition-transform origin-left">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-90">{category.count}</p>
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold">
                    Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="products-section py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 sm:px-6 py-2 rounded-full mb-3 sm:mb-4">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Trending Now</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">Bestselling Eyewear</h2>
            <p className="text-base sm:text-xl text-gray-600">Most loved by our customers</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {trendingProducts.map((product) => (
              <div
                key={product.id}
                className="product-card group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 hover:text-red-500 hover:fill-current transition-colors" />
                  </button>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-purple-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                    {product.sales} sold
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">{product.rating}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <div>
                      <span className="text-2xl sm:text-3xl font-bold text-purple-600">₹{product.price}</span>
                      <span className="text-xs sm:text-sm text-gray-500 line-through ml-2">₹{product.price + 1000}</span>
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all text-sm sm:text-base"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 sm:mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              View All Products
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-16 sm:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 sm:mb-4">Why Choose Us</h2>
            <p className="text-base sm:text-xl text-gray-600">Experience the EyeCare Hub difference</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                desc: 'On orders above ₹999',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: RotateCcw,
                title: '30-Day Returns',
                desc: 'Hassle-free returns',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Shield,
                title: '100% Authentic',
                desc: 'Certified products only',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: HeadphonesIcon,
                title: '24/7 Support',
                desc: 'Always here to help',
                color: 'from-orange-500 to-red-500'
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="feature-card bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg`}>
                  <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-pink-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-xl text-purple-100">Join 500,000+ happy customers</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl">
              <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-200 flex-shrink-0"
                />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-1 mb-3 sm:mb-4 justify-center md:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-base sm:text-xl text-gray-700 mb-4 sm:mb-6 italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  <div>
                    <div className="font-bold text-base sm:text-lg text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <button
                  onClick={prevTestimonial}
                  className="bg-purple-100 hover:bg-purple-200 p-2 sm:p-3 rounded-full transition-all hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                        idx === currentTestimonial
                          ? 'bg-purple-600 w-6 sm:w-8'
                          : 'bg-purple-200 hover:bg-purple-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="bg-purple-100 hover:bg-purple-200 p-2 sm:p-3 rounded-full transition-all hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-center text-xl sm:text-2xl font-bold text-gray-800 mb-10 sm:mb-12">
            Authorized Retailer Of Premium Brands
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12">
            {brands.map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl grayscale hover:grayscale-0 transition-all hover:scale-110"
              >
                <span>{brand.logo}</span>
                <span className="font-bold text-gray-700 text-sm sm:text-base">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">Ready to See Better?</h2>
          <p className="text-lg sm:text-2xl mb-6 sm:mb-8 text-purple-200 max-w-2xl mx-auto">
            Try our virtual try-on and find your perfect eyewear today!
          </p>
          <Link
            to="/virtual-tryon"
            className="inline-flex items-center gap-2 bg-white text-purple-900 px-8 sm:px-10 py-3 sm:py-5 rounded-full font-bold text-base sm:text-xl hover:bg-yellow-300 transition-all duration-300 shadow-2xl hover:shadow-yellow-300/50 hover:scale-105"
          >
            <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>Try Virtual Try-On</span>
          </Link>
        </div>
      </section>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
