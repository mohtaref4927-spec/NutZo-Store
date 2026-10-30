import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { CreditCard, Copy, Check, MessageSquare, ExternalLink, ShieldCheck } from 'lucide-react';

export const BankTransferView: React.FC = () => {
  const { settings, setActivePage } = useStore();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const bankDetails = settings?.bankDetails || {
    alRajhi: {
      bankName: 'مصرف الراجحي',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '482000010928374',
      iban: 'SA4880000482000010928374',
      logoText: 'Al Rajhi'
    },
    snb: {
      bankName: 'البنك الأهلي السعودي (SNB)',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '10928374000192',
      iban: 'SA1210000010928374000192',
      logoText: 'SNB'
    },
    riyad: {
      bankName: 'بنك الرياض',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '2938471029384',
      iban: 'SA7720000002938471029384',
      logoText: 'Riyad'
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const discordUrl = settings?.discordUrl || 'https://discord.gg/nutzo';

  return (
    <section className="py-8 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-950/40 border border-orange-500/25 text-xs font-bold text-orange-400 mb-2">
          <CreditCard className="w-3.5 h-3.5" />
          <span>طريقة الدفع المعتمدة</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
          التحويل البنكي المباشر
        </h2>
        <p className="text-xs sm:text-sm text-orange-200/70 mt-2 leading-relaxed">
          نقبل الدفع عبر التحويل البنكي المحلي في المملكة العربية السعودية. يرجى التحويل لحسابنا الرسمي ثم إرسال الإيصال عبر تذكرة الديسكورد.
        </p>
      </div>

      {/* Bank Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Object.entries(bankDetails).map(([key, bank]) => (
          <div
            key={key}
            className="flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#220c02]/90 to-[#140600]/95 border border-orange-500/20 shadow-lg shadow-orange-950/40 backdrop-blur-md"
          >
            <div>
              {/* Bank Title */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-orange-500/15">
                <h3 className="text-sm font-bold text-amber-200">
                  {bank.bankName}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-900/40 text-orange-300 border border-orange-500/20">
                  {bank.logoText || 'KSA'}
                </span>
              </div>

              {/* Account Details */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-orange-400/80 block mb-0.5">اسم المستفيد:</span>
                  <span className="font-semibold text-amber-50">{bank.accountHolder}</span>
                </div>

                <div>
                  <span className="text-[10px] text-orange-400/80 block mb-0.5">رقم الحساب:</span>
                  <div className="flex items-center justify-between bg-orange-950/50 p-2 rounded-xl border border-orange-500/15">
                    <span className="font-mono text-xs text-amber-100">{bank.accountNumber}</span>
                    <button
                      onClick={() => copyToClipboard(bank.accountNumber, `${key}_acc`)}
                      className="p-1 text-orange-300 hover:text-white transition-colors cursor-pointer"
                      title="نسخ رقم الحساب"
                    >
                      {copiedKey === `${key}_acc` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-orange-400/80 block mb-0.5">الآيبان (IBAN):</span>
                  <div className="flex items-center justify-between bg-orange-950/50 p-2 rounded-xl border border-orange-500/15">
                    <span className="font-mono text-[11px] text-amber-100 break-all select-all">{bank.iban}</span>
                    <button
                      onClick={() => copyToClipboard(bank.iban, `${key}_iban`)}
                      className="p-1 text-orange-300 hover:text-white transition-colors shrink-0 mr-1 cursor-pointer"
                      title="نسخ الآيبان"
                    >
                      {copiedKey === `${key}_iban` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-orange-500/15 flex items-center gap-1.5 text-[10px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>حساب رسمي موثق</span>
            </div>
          </div>
        ))}
      </div>

      {/* Important Instruction Notice Card */}
      <div className="mt-8 p-6 rounded-3xl bg-orange-950/30 border border-orange-500/20 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div>
          <h4 className="text-sm font-bold text-amber-200">
            خطوات إرسال إيصال التحويل:
          </h4>
          <p className="text-xs text-orange-200/80 mt-1 leading-relaxed">
            بعد إتمام التحويل البنكي، يرجى التوجه لسيرفر الديسكورد وفتح تذكرة طلب في قسم التذاكر وإرفاق إيصال التحويل مع رقم طلبك ليتم تسليمك فورا.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752c4] shadow-md transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>فتح تذكرة بالديسكورد</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
};
