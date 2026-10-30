import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { api } from '../lib/api.js';
import type { Order } from '../types/store.js';
import { X, MessageSquare, Copy, Check, ExternalLink, HelpCircle, CreditCard, ShieldCheck } from 'lucide-react';

export const DiscordCheckoutModal: React.FC = () => {
  const {
    isDiscordCheckoutOpen,
    setIsDiscordCheckoutOpen,
    cart,
    cartSubtotal,
    discountAmount,
    appliedCoupon,
    clearCart,
    settings,
    setIsHowToOrderOpen,
    setActivePage,
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerDiscord, setCustomerDiscord] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isDiscordCheckoutOpen) return null;

  const finalTotal = Math.max(0, cartSubtotal - discountAmount);
  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';
  const purchaseMessage = settings?.purchaseMessage || 'تنورونا وتشرفونا، لإكمال طلبك يرجى الانتقال إلى سيرفر الديسكورد وفتح تذكرة طلب متجر.';

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || cart.length === 0) return;

    try {
      setIsSubmitting(true);
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.discountedPrice ?? item.product.originalPrice,
        image: item.product.mainImage,
      }));

      const newOrder = await api.createOrder({
        customerName,
        customerDiscord,
        customerNotes,
        items: orderItems,
        subtotal: cartSubtotal,
        discountTotal: discountAmount,
        finalTotal,
        discountCode: appliedCoupon || undefined,
        paymentMethod: 'bank_transfer',
      });

      setConfirmedOrder(newOrder);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الطلب، يرجى المحاولة ثانية.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDiscordOrderText = () => {
    if (!confirmedOrder) return '';
    const itemsList = confirmedOrder.items
      .map((it) => `- ${it.productName} (العدد: ${it.quantity}) بسعر: ${it.price * it.quantity} ريال`)
      .join('\n');

    return `**طلب متجر جديد: ${confirmedOrder.orderNumber}**
اسم العميل: ${confirmedOrder.customerName}
ديسكورد: ${confirmedOrder.customerDiscord || 'غير محدد'}
طريقة الدفع: تحويل بنكي
المنتجات:
${itemsList}
المجموع النهائي: ${confirmedOrder.finalTotal} ريال
كود الخصم: ${confirmedOrder.discountCode || 'لا يوجد'}
ملاحظات: ${confirmedOrder.customerNotes || 'لا يوجد'}`;
  };

  const handleCopy = () => {
    const text = getDiscordOrderText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#220c02] via-[#170600] to-[#100300] border border-orange-500/30 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsDiscordCheckoutOpen(false);
            setConfirmedOrder(null);
          }}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedOrder ? (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>إكمال الشراء داخل ديسكورد</span>
            </div>

            <h3 className="text-xl font-black text-amber-100">
              تأكيد طلب الشراء
            </h3>

            {/* Welcoming instruction banner as requested */}
            <div className="my-4 p-3.5 rounded-2xl bg-orange-950/40 border border-orange-500/25 text-xs text-orange-200 leading-relaxed">
              <p className="font-semibold text-amber-300 mb-1">
                {purchaseMessage}
              </p>
              <p className="text-[11px] text-orange-300/80">
                يرجى تزويدنا باسمك ومعرف الديسكورد لنقوم بتجهيز تذكرتك وحجز طلبك فوراً.
              </p>
            </div>

            {/* Cart Summary */}
            <div className="p-3 rounded-xl bg-orange-950/30 border border-orange-500/15 mb-4 text-xs space-y-1">
              <div className="flex justify-between text-orange-200/80">
                <span>عدد المنتجات:</span>
                <span className="font-mono">{cart.length}</span>
              </div>
              <div className="flex justify-between font-bold text-amber-200">
                <span>المبلغ المطلوب تحويله:</span>
                <span className="font-mono text-amber-300 text-sm">{finalTotal} ريال</span>
              </div>
            </div>

            {/* Customer Inputs Form */}
            <form onSubmit={handleConfirmOrder} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  اسم العميل أو اللقب <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="مثال: محمد الشمري"
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  حسابك أو اسمك في الديسكورد (Discord Tag)
                </label>
                <input
                  type="text"
                  value={customerDiscord}
                  onChange={(e) => setCustomerDiscord(e.target.value)}
                  placeholder="مثال: nutzo_user أو username#0000"
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  ملاحظات إضافية على الطلب (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="أي تفاصيل ترغب بإيصالها للإدارة..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !customerName.trim()}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'جاري تجهيز الطلب...' : 'تأكيد وحفظ الطلب للديسكورد'}
              </button>
            </form>
          </div>
        ) : (
          /* Order Confirmed State */
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-amber-100">
              تم تجهيز طلبك برقم: <span className="text-amber-400 font-mono">{confirmedOrder.orderNumber}</span>
            </h3>

            <p className="text-xs text-orange-200/80 mt-1">
              انسخ تفاصيل الطلب أدناه وتوجه إلى سيرفر الديسكورد وافتح تذكرة ليتم خدمتك فوراً.
            </p>

            {/* Formatted Order Box */}
            <div className="my-4 p-3.5 rounded-2xl bg-orange-950/60 border border-orange-500/20 text-xs text-orange-200 font-mono space-y-1.5 whitespace-pre-wrap select-all">
              {getDiscordOrderText()}
            </div>

            {/* Action Buttons Row */}
            <div className="space-y-2.5">
              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-orange-100 bg-orange-900/60 hover:bg-orange-800/70 border border-orange-500/30 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300">تم نسخ تفاصيل الطلب بنجاح!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-orange-300" />
                    <span>نسخ تفاصيل الطلب</span>
                  </>
                )}
              </button>

              {/* Go to Discord */}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-md shadow-indigo-950/80 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>الانتقال إلى سيرفر الديسكورد</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* View Bank Details & How to Order buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setIsDiscordCheckoutOpen(false);
                    setActivePage('bank_transfer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-orange-200 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                  <span>طرق التحويل البنكي</span>
                </button>

                <button
                  onClick={() => setIsHowToOrderOpen(true)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold text-orange-200 bg-orange-950/40 hover:bg-orange-900/50 border border-orange-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
                  <span>كيف أطلب؟</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
