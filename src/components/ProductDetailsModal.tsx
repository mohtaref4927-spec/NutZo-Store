import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, ShoppingBag, CheckCircle2, XCircle, ArrowLeft, Tag, ShieldCheck, Zap } from 'lucide-react';

export const ProductDetailsModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, setIsDiscordCheckoutOpen } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!selectedProduct) return null;

  const images = [selectedProduct.mainImage, ...(selectedProduct.extraImages || [])].filter(Boolean);
  const currentImage = images[activeImageIndex] || selectedProduct.mainImage;

  const hasDiscount = !!selectedProduct.discountedPrice && selectedProduct.discountedPrice < selectedProduct.originalPrice;
  const currentPrice = hasDiscount ? selectedProduct.discountedPrice! : selectedProduct.originalPrice;

  const handleInstantBuy = () => {
    addToCart(selectedProduct, 1);
    setSelectedProduct(null);
    setIsDiscordCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-gradient-to-b from-[#220c02] via-[#170600] to-[#100300] border border-orange-500/30 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 left-4 z-20 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
          
          {/* Images Section */}
          <div className="flex flex-col gap-3">
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#100300] border border-orange-500/25">
              <img
                src={currentImage}
                alt={selectedProduct.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
                }}
              />

              {hasDiscount && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-black bg-red-600 text-white shadow-lg">
                    خصم {selectedProduct.discountPercent ? `${selectedProduct.discountPercent}%` : `${selectedProduct.originalPrice - selectedProduct.discountedPrice!} ريال`}
                  </span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border transition-all cursor-pointer ${
                      activeImageIndex === idx
                        ? 'border-orange-500 ring-2 ring-orange-500/40 scale-105'
                        : 'border-orange-500/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase Information */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-orange-400">
                  {selectedProduct.category || 'عام'}
                </span>

                {selectedProduct.isAvailable ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>متوفر للتسليم</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded-md">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>غير متوفر حالياً</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-black text-amber-100 leading-snug">
                {selectedProduct.name}
              </h2>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 my-4 p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/20">
                {hasDiscount && (
                  <div className="flex flex-col">
                    <span className="text-[10px] text-red-400 font-semibold">السعر القديم</span>
                    <span className="text-sm line-through text-red-400/90 font-mono">
                      {selectedProduct.originalPrice} ريال
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-[10px] text-amber-400 font-semibold">
                    {hasDiscount ? 'السعر بعد الخصم' : 'السعر الرسمي'}
                  </span>
                  <span className="text-2xl font-black text-amber-300 font-mono tabular-nums">
                    {currentPrice} <span className="text-xs font-sans text-orange-200">ريال</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 text-xs text-orange-200/80 leading-relaxed max-h-48 overflow-y-auto pr-1">
                <p className="whitespace-pre-line">{selectedProduct.description}</p>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-orange-500/15 text-[11px] text-orange-300/80">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>تسليم فوري ومباشر</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span>ضمان كامل وخدمة 24/7</span>
                </div>
              </div>
            </div>

            {/* Buttons Row */}
            <div className="flex flex-col sm:flex-row gap-2.5 mt-6 pt-4 border-t border-orange-500/20">
              <button
                onClick={() => {
                  addToCart(selectedProduct, 1);
                  setSelectedProduct(null);
                }}
                disabled={!selectedProduct.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-orange-100 bg-orange-950/50 hover:bg-orange-900/70 border border-orange-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4 text-orange-300" />
                <span>إضافة إلى السلة</span>
              </button>

              <button
                onClick={handleInstantBuy}
                disabled={!selectedProduct.isAvailable}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>شراء فوري عبر Discord</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
