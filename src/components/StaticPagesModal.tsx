import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, ShieldCheck, FileText, Info } from 'lucide-react';

interface StaticPagesModalProps {
  pageType: 'privacy' | 'terms' | 'about' | null;
  onClose: () => void;
}

export const StaticPagesModal: React.FC<StaticPagesModalProps> = ({ pageType, onClose }) => {
  const { settings } = useStore();

  if (!pageType) return null;

  const contentMap = {
    privacy: {
      title: 'سياسة الخصوصية',
      icon: ShieldCheck,
      content: settings?.policies?.privacyPolicy || 'نحن في NUTZO STORE نحترم خصوصيتك ونتعهد بحماية كافة البيانات المدخلة في طلباتك ولا نشاركها مع أي طرف ثالث إطلاقاً.'
    },
    terms: {
      title: 'شروط الاستخدام والضمان',
      icon: FileText,
      content: settings?.policies?.termsOfService || 'جميع المشتريات تخضع لسياسة الضمان المعتمدة في سيرفر الديسكورد، ويتم تنفيذ الطلبات وتسليمها فور التحقق من إيصال التحويل البنكي.'
    },
    about: {
      title: 'معلومات عن متجر نوتزو',
      icon: Info,
      content: settings?.policies?.aboutUs || 'متجر نوتزو هو متجر رقمي متكامل يقدم أفضل الخدمات والمنتجات بجودة عالية وضمان ذهبي مع دعم فني متواصل على مدار الساعة.'
    }
  };

  const current = contentMap[pageType];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#220c02] via-[#170600] to-[#100300] border border-orange-500/30 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
          <Icon className="w-4 h-4" />
          <span>المعلومات والسياسات الرسمية</span>
        </div>

        <h3 className="text-xl font-black text-amber-100 mb-4">
          {current.title}
        </h3>

        <div className="p-4 rounded-2xl bg-orange-950/40 border border-orange-500/20 text-xs sm:text-sm text-orange-200 leading-relaxed whitespace-pre-line max-h-96 overflow-y-auto">
          {current.content}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-700 hover:bg-orange-600 transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
