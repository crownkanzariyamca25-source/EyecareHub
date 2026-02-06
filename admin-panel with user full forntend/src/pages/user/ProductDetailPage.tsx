import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RefreshCw, ChevronLeft, Check } from 'lucide-react';
import { storeProducts, StoreProduct } from '../../data/storeProducts';
import { useCart } from '../../contexts/CartContext';

interface ProductDetailPageProps {
  productId: string;
  onNavigate: (page: string, data?: Record<string, unknown>) => void;
}

export function ProductDetailPage({ productId, onNavigate }: ProductDetailPageProps) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const found = storeProducts.find(p => p.id === productId);
    setProduct(found || null);
  }, [productId]);

  useEffect(() => {
    if (product && containerRef.current) {
      gsap.fromTo('.product-image',
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' }
      );
      gsap.fromTo('.product-info > *',
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [product]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
        <button
          onClick={() => onNavigate('products')}
          className="text-violet-600 font-medium hover:text-violet-700"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
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
    }, quantity);
    setToast(`${quantity} x ${product.name} added to cart!`);
  };

  const relatedProducts = storeProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 py-8">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          {toast}
        </div>
      )}

      {/* Breadcrumb */}
      <button
        onClick={() => onNavigate('products')}
        className="flex items-center gap-2 text-gray-500 hover:text-violet-600 mb-8"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Products
      </button>

      {/* Product Details */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="product-image">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 flex items-center justify-center">
            <span className="text-[200px]">{product.image}</span>
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            {product.images.map((img, index) => (
              <button
                key={index}
                className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl hover:ring-2 hover:ring-violet-500 transition-all"
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-violet-600 font-medium">{product.brand}</span>
              {product.isNew && (
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">New</span>
              )}
              {product.isBestseller && (
                <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Bestseller</span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-400">({product.reviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                <span className="bg-red-100 text-red-700 text-sm px-2 py-0.5 rounded-full font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-emerald-500" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
            {product.frameType && (
              <div>
                <p className="text-sm text-gray-500">Frame Type</p>
                <p className="font-medium">{product.frameType}</p>
              </div>
            )}
            {product.lensType && (
              <div>
                <p className="text-sm text-gray-500">Lens Type</p>
                <p className="font-medium">{product.lensType}</p>
              </div>
            )}
            {product.material && (
              <div>
                <p className="text-sm text-gray-500">Material</p>
                <p className="font-medium">{product.material}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Color</p>
              <p className="font-medium">{product.color}</p>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center border border-gray-200 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-gray-500 hover:text-gray-700"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="p-3 text-gray-500 hover:text-gray-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-500 hover:to-purple-500 transition-all"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
            <button className="p-3 border border-gray-200 rounded-xl text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
          </div>

          {/* Stock */}
          <p className={`text-sm mb-6 ${product.stock > 20 ? 'text-emerald-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {product.stock > 20 ? `✓ In Stock (${product.stock} available)` : 
             product.stock > 0 ? `⚠ Only ${product.stock} left in stock` : 
             '✕ Out of Stock'}
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-violet-50 rounded-xl">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto text-violet-600 mb-1" />
              <p className="text-xs text-gray-600">Free Shipping</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto text-violet-600 mb-1" />
              <p className="text-xs text-gray-600">2 Year Warranty</p>
            </div>
            <div className="text-center">
              <RefreshCw className="w-6 h-6 mx-auto text-violet-600 mb-1" />
              <p className="text-xs text-gray-600">30-Day Returns</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => onNavigate('product-detail', { productId: relatedProduct.id })}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-6xl text-center">{relatedProduct.image}</div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-violet-600 font-medium">{relatedProduct.brand}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{relatedProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">${relatedProduct.price}</span>
                    {relatedProduct.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">${relatedProduct.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
