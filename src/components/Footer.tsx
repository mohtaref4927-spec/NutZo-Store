import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { StaticPagesModal } from './StaticPagesModal.js';
import type { ActivePage } from '../types/store.js';
import { MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, settings } = useStore();
  const [staticPage, setStaticPage] = useState<'privacy' | 'terms' | 'about' | null>(null);

  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';
  const logoUrl = settings?.logoUrl || '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg';
  const storeName = settings?.storeName || 'NUTZO STORE';

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="mt-16 border-t border-orange-500/20 bg-gradient-to-b from-[#140600] to-[#0a0200] text-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-orange-500/15">
            
            {/* Col 1: Brand & Tagline */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl overflow-hidden p-0.5 bg-gradient-to-tr from-orange-600 to-amber-400 border border-orange-400/30 shadow-md">
                  <img
                    src={logoUrl}
                    alt={storeName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <span className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]">
                  {storeName}
                </span>
              </div>

              <p className="text-xs text-orange-200/70 max-w-sm leading-relaxed">
                وجهتك الرقمية المتكاملة لأرقى المنتجات والخدمات الرقمية مع تسليم فوري وضمان شامل ودعم فني متميز على مدار الساعة.
              </p>

              <div className="pt-1">
                <a
                  href={discordUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-sm transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>انضم لسيرفر الديسكورد</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div>
              <h4 className="text-xs font-bold text-amber-200 mb-3 tracking-wide">
                روابط المتجر السريعة
              </h4>
              <ul className="space-y-2 text-xs text-orange-200/80">
                <li>
                  <button onClick={() => navigateTo('home')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    الرئيسية
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('products')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    تصفح المنتجات
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('categories')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    الأقسام والتصنيفات
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('reviews')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    آراء وتقييمات العملاء
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('faq')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    الأسئلة الشائعة
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Legal & Support */}
            <div>
              <h4 className="text-xs font-bold text-amber-200 mb-3 tracking-wide">
                الضمان والدفع
              </h4>
              <ul className="space-y-2 text-xs text-orange-200/80">
                <li>
                  <button onClick={() => navigateTo('bank_transfer')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    طرق التحويل البنكي
                  </button>
                </li>
                <li>
                  <button onClick={() => setStaticPage('privacy')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    سياسة الخصوصية
                  </button>
                </li>
                <li>
                  <button onClick={() => setStaticPage('terms')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    شروط الاستخدام والضمان
                  </button>
                </li>
                <li>
                  <button onClick={() => setStaticPage('about')} className="hover:text-amber-300 transition-colors cursor-pointer">
                    معلومات المتجر
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Bottom Copyright Strip - Exclusive branding as requested */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-orange-300/70">
            <p>
              © Store Zorven - NUTZO STORE. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-orange-400/80">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>تسوق آمن ومضمون 100%</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Static Policies Modal */}
      <StaticPagesModal
        pageType={staticPage}
        onClose={() => setStaticPage(null)}
      />
    </>
  );
};
