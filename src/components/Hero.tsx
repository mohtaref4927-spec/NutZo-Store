import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { ArrowLeft, MessageSquare, HelpCircle, ShieldCheck, Zap, Headphones, CreditCard } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setActivePage, setIsHowToOrderOpen, settings } = useStore();

  const storeName = settings?.storeName || 'NUTZO STORE';
  const tagline = settings?.tagline || 'عالمك الرقمي يبدأ من هنا';
  const description = settings?.description || 'مرحبًا بك في متجر نوتزو، وجهتك الأولى لأرقى المنتجات والخدمات مع ضمان وتسليم فوري ودعم فني متميز.';
  const logoUrl = settings?.logoUrl || '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';

  return (
    <section className="relative pt-6 pb-12 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Main Hero Card Container with Orange Glow & Ambient Backdrop */}
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-14 overflow-hidden border border-orange-500/25 bg-gradient-to-b from-[#240b00]/80 via-[#180700]/90 to-[#100400]/95 shadow-2xl shadow-orange-950/80 backdrop-blur-xl">
          
          {/* Subtle Ambient Glow behind mascot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Decorative Corner Flairs */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/15 to-transparent rounded-tr-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-bl-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Mascot Centerpiece */}
            <div className="relative mb-6 group cursor-pointer">
              <div className="absolute -inset-2 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-3xl blur-lg opacity-40 group-hover:opacity-75 transition-opacity duration-300" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden p-1 bg-[#1a0800] border border-orange-400/40 shadow-xl shadow-orange-950/60 transform group-hover:scale-105 transition-transform duration-300">
                <img
                  src={logoUrl}
                  alt={storeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Store Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif] drop-shadow-sm">
              {storeName}
            </h1>

            {/* Tagline */}
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100 mt-2">
              "{tagline}"
            </h2>

            {/* Description */}
            <p className="max-w-2xl text-xs sm:text-sm text-orange-200/80 mt-3 leading-relaxed">
              {description}
            </p>

            {/* Action Buttons Row - Sleek & Compact */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mt-7">
              
              {/* Browse Products */}
              <button
                onClick={() => {
                  setActivePage('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/60 transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <span>تصفح المنتجات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* Join Discord */}
              <a
                href={discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-indigo-100 bg-[#5865F2]/25 hover:bg-[#5865F2]/40 border border-[#5865F2]/50 shadow-sm transition-all hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-indigo-300" />
                <span>الانضمام إلى الديسكورد</span>
              </a>

              {/* How to Order */}
              <button
                onClick={() => setIsHowToOrderOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-orange-200 hover:text-white bg-orange-950/40 hover:bg-orange-900/60 border border-orange-500/30 transition-all hover:scale-[1.03] cursor-pointer"
              >
                <HelpCircle className="w-4 h-4 text-orange-400" />
                <span>كيف أطلب؟</span>
              </button>
            </div>
          </div>
        </div>

        {/* Value Props / Trust Indicators Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-950/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100">تسليم فوري</h3>
              <p className="text-[11px] text-orange-300/70">تنفيذ سريع لجميع طلباتك</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-950/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100">ضمان ذهبي</h3>
              <p className="text-[11px] text-orange-300/70">ضمان موثوق طوال المدة</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-950/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100">دعم متواصل 24/7</h3>
              <p className="text-[11px] text-orange-300/70">تذاكر ديسكورد سريعة</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-orange-950/30 border border-orange-500/20 backdrop-blur-sm">
            <div className="p-2 rounded-xl bg-orange-600/20 text-orange-400 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-100">تحويل بنكي رسمي</h3>
              <p className="text-[11px] text-orange-300/70">الراجحي، الأهلي، الرياض</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
