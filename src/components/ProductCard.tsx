import React from 'react';
import type { Product } from '../types/store.js';
import { useStore } from '../context/StoreContext.js';
import { ShoppingBag, Eye, CheckCircle2, XCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useStore();

  const hasDiscount = !!product.discountedPrice && product.discountedPrice < product.originalPrice;
  const currentPrice = hasDiscount ? product.discountedPrice! : product.originalPrice;

  return (
    <div className="group relative flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#220c02]/90 to-[#150600]/95 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/60 backdrop-blur-md">
      
      {/* Product Image Container */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative w-full aspect-[4/3] overflow-hidden bg-[#100300] cursor-pointer"
      >
        <img
          src={product.mainImage}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
          }}
        />

        {/* Floating Availability Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {product.isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              <span>متوفر</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-500/30 backdrop-blur-md shadow-sm">
              <XCircle className="w-3 h-3" />
              <span>غير متوفر</span>
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-red-600/90 text-white shadow-md shadow-red-950/60">
              خصم {product.discountPercent ? `${product.discountPercent}%` : `${product.originalPrice - product.discountedPrice!} ريال`}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-4">
        {/* Category */}
        <span className="text-[11px] font-medium text-orange-400/80 mb-1">
          {product.category || 'عام'}
        </span>

        {/* Product Name */}
        <h3 
          onClick={() => setSelectedProduct(product)}
          className="text-sm font-bold text-amber-50 group-hover:text-amber-200 transition-colors line-clamp-1 cursor-pointer"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Product Description snippet */}
        <p className="text-xs text-orange-200/60 line-clamp-2 mt-1 min-h-[32px] leading-relaxed">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="mt-3 pt-3 border-t border-orange-500/15 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-xs line-through text-red-400/90 font-mono">
                {product.originalPrice} ريال
              </span>
            )}
            <span className="text-base font-extrabold text-amber-300 font-mono tabular-nums">
              {currentPrice} <span className="text-xs font-sans text-orange-200/80">ريال</span>
            </span>
          </div>
        </div>

        {/* Actions Row */}
        <div className="grid grid-cols-2 gap-2 mt-3.5">
          <button
            onClick={() => setSelectedProduct(product)}
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold text-orange-200 hover:text-white bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/25 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>التفاصيل</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            disabled={!product.isAvailable}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              product.isAvailable
                ? 'text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm shadow-orange-950/60 hover:scale-[1.02]'
                : 'text-stone-400 bg-stone-900/50 border border-stone-800 cursor-not-allowed opacity-60'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>إضافة للسلة</span>
          </button>
        </div>
      </div>
    </div>
  );
};
