import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

export const FaqSection: React.FC = () => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: 'كيف يمكنني الطلب وإكمال الشراء في متجر نوتزو؟',
      a: 'الطلب في غاية السهولة: اختر المنتجات وضعها في السلة، ثم اضغط على زر "إكمال الشراء داخل ديسكورد"، سينشئ لك النظام تفاصيل طلبك مع رمز الطلب، ثم توجه لسيرفر الديسكورد وافتح تذكرة طلب والصق التفاصيل.'
    },
    {
      q: 'ما هي طرق الدفع المتاحة في المتجر؟',
      a: 'طريقة الدفع الرسمية المعتمدة هي التحويل البنكي المباشر (مصرف الراجحي، البنك الأهلي السعودي، بنك الرياض). لا نستخدم أي بوابات دفع إلكترونية خارجية حفاظاً على أمان وسلاسة المعاملات.'
    },
    {
      q: 'كم يستغرق تسليم الطلبات؟',
      a: 'التسليم فوري خلال دقائق معدودة فور تأكيد إيصال التحويل في تذكرة الديسكورد، حيث يتواجد فريق الدعم الفني على مدار الساعة لخدمتكم.'
    },
    {
      q: 'هل توجد ضمانات على المنتجات والاشتراكات؟',
      a: 'نعم بالتأكيد، جميع المنتجات تخضع لضمان كامل وموثق طوال فترة الاشتراك المحددة مع استبدال فوري أو حل أي استفسار.'
    },
    {
      q: 'كيف يمكنني استخدام كود الخصم؟',
      a: 'يمكنك إدخال كود الخصم في خانة كوبون الخصم داخل سلة المشتريات والضغط على "تطبيق"، وسيتم خصم القيمة فوراً من إجمالي الطلب.'
    }
  ];

  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';

  return (
    <section className="py-8 max-w-4xl mx-auto px-4 sm:px-6">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-950/40 border border-orange-500/25 text-xs font-bold text-orange-400 mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
          الأسئلة الشائعة
        </h2>
        <p className="text-xs sm:text-sm text-orange-200/70 mt-2">
          إليك أبرز الإجابات على الأسئلة المتكررة حول الطلب والتحويل والتسليم.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="rounded-2xl border border-orange-500/20 bg-gradient-to-b from-[#220c02]/80 to-[#140600]/90 backdrop-blur-md overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-right cursor-pointer"
              >
                <span className="text-xs sm:text-sm font-bold text-amber-100 hover:text-amber-300 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-orange-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-amber-300' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-orange-200/80 leading-relaxed border-t border-orange-500/10">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center p-6 rounded-3xl bg-orange-950/20 border border-orange-500/15 backdrop-blur-md">
        <p className="text-xs text-orange-300/80 mb-3">
          لديك سؤال آخر أو ترغب باستفسار خاص؟ تواصل معنا مباشرة عبر سيرفر الديسكورد!
        </p>
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-md transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>فتح تذكرة استفسار</span>
        </a>
      </div>
    </section>
  );
};
