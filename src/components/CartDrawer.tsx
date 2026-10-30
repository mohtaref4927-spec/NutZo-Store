import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag, Check, AlertCircle } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    couponMessage,
    applyCouponCode,
    removeCouponCode,
    setIsDiscordCheckoutOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  if (!isCartOpen) return null;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplyingCoupon(true);
    await applyCouponCode(couponInput);
    setIsApplyingCoupon(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsDiscordCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm" dir="rtl">
      <div 
        className="relative w-full max-w-md h-full bg-gradient-to-b from-[#1e0a01] via-[#150500] to-[#0c0200] border-l border-orange-500/30 shadow-2xl flex flex-col text-amber-50 animate-in slide-in-from-left duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-orange-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h3 className="text-base font-extrabold text-amber-100">
              سلة المشتريات ({cart.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[11px] text-orange-400/80 hover:text-red-400 transition-colors cursor-pointer"
              >
                تفريغ السلة
              </button>
            )}
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 cursor-pointer"
              aria-label="إغلاق السلة"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length > 0 ? (
            cart.map((item) => {
              const product = item.product;
              const hasDiscount = !!product.discountedPrice && product.discountedPrice < product.originalPrice;
              const price = hasDiscount ? product.discountedPrice! : product.originalPrice;

              return (
                <div
                  key={product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-orange-950/30 border border-orange-500/20"
                >
                  {/* Thumbnail */}
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#100300] border border-orange-500/20"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-amber-100 line-clamp-1">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-orange-400/60 hover:text-red-400 p-0.5 cursor-pointer"
                          title="حذف من السلة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-orange-400/80 block mt-0.5">
                        {product.category || 'عام'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <span className="text-xs font-bold text-amber-300 font-mono">
                        {price * item.quantity} ريال
                      </span>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-1.5 bg-orange-950/60 border border-orange-500/25 rounded-lg px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity - 1)}
                          className="p-0.5 text-orange-300 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, item.quantity + 1)}
                          className="p-0.5 text-orange-300 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center mb-3 text-orange-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-sm font-bold text-amber-100">سلة المشتريات فارغة</h4>
              <p className="text-xs text-orange-300/70 mt-1 max-w-xs">
                تصفح المنتجات في المتجر وأضف ما يناسبك إلى السلة.
              </p>
            </div>
          )}
        </div>

        {/* Drawer Footer (Coupons & Checkout) */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-orange-500/20 bg-[#160600] space-y-3">
            
            {/* Coupon Code Input */}
            <form onSubmit={handleApply} className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="كود الخصم (اختياري)"
                    className="w-full pr-8 pl-3 py-1.5 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-100 placeholder-orange-300/40 uppercase font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponInput.trim()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-orange-700 hover:bg-orange-600 border border-orange-500/30 cursor-pointer disabled:opacity-50"
                >
                  تطبيق
                </button>
              </div>

              {/* Coupon applied tag or message */}
              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <div className="flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>تم تطبيق الكود: <strong>{appliedCoupon}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCouponCode}
                    className="text-red-400 hover:underline cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}

              {couponMessage && !appliedCoupon && (
                <div className="flex items-center gap-1 text-[11px] text-amber-400">
                  <AlertCircle className="w-3 h-3" />
                  <span>{couponMessage}</span>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-2 border-t border-orange-500/15">
              <div className="flex justify-between text-orange-200/80">
                <span>المجموع الفرعي:</span>
                <span className="font-mono">{cartSubtotal} ريال</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-red-400 font-semibold">
                  <span>قيمة الخصم:</span>
                  <span className="font-mono">-{discountAmount} ريال</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-extrabold text-amber-200 pt-1 border-t border-orange-500/15">
                <span>الإجمالي النهائي:</span>
                <span className="font-mono text-base text-amber-300">{finalTotal} ريال</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <span>متابعة الشراء (Discord)</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
