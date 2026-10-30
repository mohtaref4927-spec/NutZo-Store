import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, MessageSquare, ExternalLink, CheckCircle } from 'lucide-react';

export const HowToOrderModal: React.FC = () => {
  const { isHowToOrderOpen, setIsHowToOrderOpen, settings } = useStore();

  if (!isHowToOrderOpen) return null;

  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';

  const steps = [
    { num: 1, title: 'ادخل إلى سيرفر الديسكورد', desc: 'انقر على زر الانتقال إلى الديسكورد للانضمام إلى مجتمع وسيرفر NUTZO STORE الرسمي.' },
    { num: 2, title: 'افتح قسم التذاكر', desc: 'توجه إلى قناة أو روم التذاكر المخصصة في أعلى قائمة الرومات.' },
    { num: 3, title: 'اختر فتح تذكرة طلب متجر', desc: 'اضغط على زر إنشاء تذكرة جديدة باسم (طلب متجر / Store Order).' },
    { num: 4, title: 'اكتب اسم المنتج أو الصق رقم الطلب', desc: 'الصق تفاصيل طلبك المنسوخة من الموقع أو اذكر اسم المنتج المطلوب.' },
    { num: 5, title: 'أرسل تفاصيل طلبك وانتظر رد الإدارة', desc: 'أرفق إيصال التحويل البنكي وسيقوم فريق الدعم بتسليمك طلبك فوراً وبكل احترافية.' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-lg rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#220c02] via-[#170600] to-[#100300] border border-orange-500/30 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsHowToOrderOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-black text-amber-100 mb-1">
          كيف أطلب من متجر نوتزو؟
        </h3>
        <p className="text-xs text-orange-200/70 mb-6">
          خطوات بسيطة وسريعة لإكمال وشراء أي منتج عبر سيرفر الديسكورد:
        </p>

        {/* 5 Steps List */}
        <div className="space-y-3.5 mb-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex items-start gap-3 p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/20"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm font-mono">
                {step.num}
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-100">
                  {step.title}
                </h4>
                <p className="text-[11px] text-orange-200/70 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Discord Action Button */}
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-md shadow-indigo-950/80 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>الانتقال إلى الديسكورد الآن</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
