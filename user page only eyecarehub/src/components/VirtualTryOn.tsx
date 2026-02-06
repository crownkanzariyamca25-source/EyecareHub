import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RotateCcw, ZoomIn, ZoomOut, Move, Download, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';

interface GlassesOption {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
}

const glassesOptions: GlassesOption[] = [
  { id: '1', name: 'Classic Aviator', image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', category: 'Sunglasses', price: 2999 },
  { id: '2', name: 'Round Frame', image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400', category: 'Eyeglasses', price: 1999 },
  { id: '3', name: 'Cat Eye Style', image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?w=400', category: 'Sunglasses', price: 2499 },
  { id: '4', name: 'Wayfarer Classic', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'Sunglasses', price: 3499 },
  { id: '5', name: 'Rectangular Frame', image: 'https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?w=400', category: 'Eyeglasses', price: 1799 },
  { id: '6', name: 'Oversized Glam', image: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=400', category: 'Sunglasses', price: 2799 },
];

export default function VirtualTryOn() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedGlasses, setSelectedGlasses] = useState<GlassesOption | null>(null);
  const [glassesPosition, setGlassesPosition] = useState({ x: 50, y: 35 });
  const [glassesSize, setGlassesSize] = useState(100);
  const [glassesRotation, setGlassesRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glassesRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.from('.tryon-header', {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.glasses-gallery-item', {
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.glasses-gallery',
        start: 'top 80%'
      }
    });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        gsap.from('.preview-container', {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGlassesSelect = (glasses: GlassesOption) => {
    setSelectedGlasses(glasses);
    if (glassesRef.current) {
      gsap.fromTo(glassesRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      );
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!selectedGlasses) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - glassesPosition.x, y: e.clientY - glassesPosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlassesPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    setGlassesPosition({ x: 50, y: 35 });
    setGlassesSize(100);
    setGlassesRotation(0);
    if (glassesRef.current) {
      gsap.to(glassesRef.current, {
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    }
  };

  const downloadImage = () => {
    if (!containerRef.current) return;
    // Simple download implementation
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // This is a placeholder - in production, you'd use html2canvas or similar
    alert('Download feature - In production, this would capture and download the combined image!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="tryon-header text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">AI-Powered Virtual Try-On</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Try Before You Buy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Upload your photo and see how you look in our amazing collection of eyewear. 
            Drag, resize, and rotate to get the perfect fit!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Upload & Preview Section */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-purple-600" />
              Your Photo
            </h2>

            {!uploadedImage ? (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-4 border-dashed border-purple-300 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 group"
                >
                  <Upload className="w-16 h-16 mx-auto mb-4 text-purple-400 group-hover:text-purple-600 group-hover:scale-110 transition-all" />
                  <h3 className="text-xl font-semibold mb-2">Upload Your Photo</h3>
                  <p className="text-gray-500 mb-4">Click to browse or drag and drop</p>
                  <p className="text-sm text-gray-400">Supported formats: JPG, PNG (Max 5MB)</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Tips */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
                  <h4 className="font-semibold mb-3 text-purple-900">📸 Tips for best results:</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Face the camera directly with good lighting</li>
                    <li>• Remove any existing glasses</li>
                    <li>• Keep hair away from your face</li>
                    <li>• Use a plain background if possible</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div
                  ref={containerRef}
                  className="preview-container relative bg-gray-100 rounded-2xl overflow-hidden"
                  style={{ aspectRatio: '3/4', maxHeight: '600px' }}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <img
                    src={uploadedImage}
                    alt="Your photo"
                    className="w-full h-full object-cover"
                  />
                  
                  {selectedGlasses && (
                    <img
                      ref={glassesRef}
                      src={selectedGlasses.image}
                      alt={selectedGlasses.name}
                      className={`absolute pointer-events-none mix-blend-multiply ${isDragging ? 'cursor-move' : ''}`}
                      style={{
                        left: `${glassesPosition.x}%`,
                        top: `${glassesPosition.y}%`,
                        transform: `translate(-50%, -50%) scale(${glassesSize / 100}) rotate(${glassesRotation}deg)`,
                        width: '60%',
                        maxWidth: '400px',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        pointerEvents: 'auto',
                      }}
                      onMouseDown={handleMouseDown}
                      draggable={false}
                    />
                  )}

                  {selectedGlasses && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                      <p className="font-semibold text-sm">{selectedGlasses.name}</p>
                      <p className="text-purple-600 font-bold">₹{selectedGlasses.price}</p>
                    </div>
                  )}
                </div>

                {/* Controls */}
                {selectedGlasses && (
                  <div className="space-y-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Move className="w-5 h-5 text-purple-600" />
                      Adjust Glasses
                    </h3>

                    {/* Size Control */}
                    <div>
                      <label className="text-sm font-medium flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <ZoomIn className="w-4 h-4" />
                          Size: {glassesSize}%
                        </span>
                      </label>
                      <input
                        type="range"
                        min="50"
                        max="200"
                        value={glassesSize}
                        onChange={(e) => setGlassesSize(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    {/* Rotation Control */}
                    <div>
                      <label className="text-sm font-medium flex items-center justify-between mb-2">
                        <span className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4" />
                          Rotation: {glassesRotation}°
                        </span>
                      </label>
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        value={glassesRotation}
                        onChange={(e) => setGlassesRotation(Number(e.target.value))}
                        className="w-full accent-purple-600"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={resetPosition}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                      <button
                        onClick={downloadImage}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    setUploadedImage(null);
                    setSelectedGlasses(null);
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Upload Different Photo
                </button>
              </div>
            )}
          </div>

          {/* Glasses Selection */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6">Choose Your Style</h2>
            
            <div className="glasses-gallery grid grid-cols-2 gap-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
              {glassesOptions.map((glasses) => (
                <div
                  key={glasses.id}
                  onClick={() => handleGlassesSelect(glasses)}
                  className={`glasses-gallery-item cursor-pointer rounded-2xl overflow-hidden border-4 transition-all duration-300 hover:scale-105 ${
                    selectedGlasses?.id === glasses.id
                      ? 'border-purple-600 shadow-2xl shadow-purple-200'
                      : 'border-transparent hover:border-purple-300'
                  }`}
                >
                  <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                    <img
                      src={glasses.image}
                      alt={glasses.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-sm mb-1">{glasses.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{glasses.category}</p>
                    <p className="text-purple-600 font-bold">₹{glasses.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: '🎯', title: 'Perfect Fit', desc: 'Adjust size and position' },
            { icon: '🔄', title: 'Real-time Preview', desc: 'See instant results' },
            { icon: '💾', title: 'Save & Share', desc: 'Download your try-on' },
            { icon: '✨', title: 'AI Powered', desc: 'Smart face detection' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7e22ce, #db2777);
        }
      `}</style>
    </div>
  );
}
