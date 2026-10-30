import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { StaticPagesModal } from './StaticPagesModal.js';
import {
  X,
  Settings,
  ChevronDown,
  Palette,
  CreditCard,
  FileText,
  User,
  Shield,
  KeyRound,
  LogOut,
  LayoutDashboard,
  Check,
  Globe,
} from 'lucide-react';

export const SettingsRightDrawer: React.FC = () => {
  const {
    isSettingsDrawerOpen,
    setIsSettingsDrawerOpen,
    setIsAdminLoginOpen,
    isAdminLoggedIn,
    setIsAdminDashboardOpen,
    logoutAdmin,
    setActivePage,
  } = useStore();

  const [openSection, setOpenSection] = useState<'site' | 'payment' | 'policies' | 'accounts' | null>('accounts');
  const [adminStep, setAdminStep] = useState<number>(0);
  const [staticPageModal, setStaticPageModal] = useState<'privacy' | 'terms' | 'about' | null>(null);
  const [langToast, setLangToast] = useState(false);

  if (!isSettingsDrawerOpen) return null;

  const toggleSection = (section: 'site' | 'payment' | 'policies' | 'accounts') => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleOpenBankTransfer = () => {
    setIsSettingsDrawerOpen(false);
    setActivePage('bank_transfer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLanguageSwitch = () => {
    setLangToast(true);
    setTimeout(() => setLangToast(false), 2000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm" dir="rtl">
        <div 
          className="relative w-full max-w-sm h-full bg-gradient-to-b from-[#1d0901] via-[#140600] to-[#0d0300] border-l border-orange-500/30 shadow-2xl flex flex-col text-amber-50 animate-in slide-in-from-left duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-orange-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-extrabold text-amber-100">
                الإعدادات والخيارات
              </h3>
            </div>
            <button
              onClick={() => setIsSettingsDrawerOpen(false)}
              className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 cursor-pointer"
              aria-label="إغلاق الإعدادات"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body - Accordion Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            
            {/* 1. إعدادات الموقع والمظهر */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-950/25 overflow-hidden">
              <button
                onClick={() => toggleSection('site')}
                className="w-full p-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-orange-900/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-amber-100">إعدادات الموقع والمظهر</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-orange-400 transition-transform ${openSection === 'site' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'site' && (
                <div className="p-3 pt-1 border-t border-orange-500/10 space-y-2 bg-[#120400]/40">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-orange-950/40 text-xs">
                    <span className="text-orange-200/80">المظهر المعتمد:</span>
                    <span className="font-bold text-amber-300 text-[11px] bg-orange-600/30 px-2 py-0.5 rounded border border-orange-500/30">
                      برتقالي فاخر ذهبي
                    </span>
                  </div>

                  <button
                    onClick={handleLanguageSwitch}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-orange-950/40 text-xs hover:bg-orange-900/40 transition-colors cursor-pointer text-orange-200"
                  >
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-orange-400" />
                      <span>اللغة (Language)</span>
                    </div>
                    <span className="text-[11px] font-bold text-amber-300">العربية (RTL)</span>
                  </button>

                  {langToast && (
                    <div className="text-[10px] text-center text-amber-300 bg-orange-950 p-1.5 rounded-lg border border-orange-500/20">
                      المتجر مضبوط افتراضياً على اللغة العربية مع دعم كامل لـ RTL
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. طرق الدفع والتحويل */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-950/25 overflow-hidden">
              <button
                onClick={() => toggleSection('payment')}
                className="w-full p-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-orange-900/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-amber-100">طرق الدفع والتحويل</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-orange-400 transition-transform ${openSection === 'payment' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'payment' && (
                <div className="p-3 pt-1 border-t border-orange-500/10 space-y-2 bg-[#120400]/40">
                  <button
                    onClick={handleOpenBankTransfer}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-amber-100 bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/20 flex items-center justify-between cursor-pointer"
                  >
                    <span>استعراض حسابات التحويل البنكي</span>
                    <span className="text-[10px] text-orange-400">الراجحي / الأهلي / الرياض</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3. السياسات والشروط */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-950/25 overflow-hidden">
              <button
                onClick={() => toggleSection('policies')}
                className="w-full p-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-orange-900/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-amber-100">السياسات والشروط</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-orange-400 transition-transform ${openSection === 'policies' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'policies' && (
                <div className="p-3 pt-1 border-t border-orange-500/10 space-y-1.5 bg-[#120400]/40">
                  <button
                    onClick={() => setStaticPageModal('privacy')}
                    className="w-full text-right p-2 rounded-xl text-xs text-orange-200/90 hover:text-white hover:bg-orange-900/40 cursor-pointer transition-colors"
                  >
                    • سياسة الخصوصية
                  </button>
                  <button
                    onClick={() => setStaticPageModal('terms')}
                    className="w-full text-right p-2 rounded-xl text-xs text-orange-200/90 hover:text-white hover:bg-orange-900/40 cursor-pointer transition-colors"
                  >
                    • شروط الاستخدام والضمان
                  </button>
                  <button
                    onClick={() => setStaticPageModal('about')}
                    className="w-full text-right p-2 rounded-xl text-xs text-orange-200/90 hover:text-white hover:bg-orange-900/40 cursor-pointer transition-colors"
                  >
                    • معلومات عن متجر نوتزو
                  </button>
                </div>
              )}
            </div>

            {/* 4. الحسابات والإدارة (المسار السري المحدد) */}
            <div className="rounded-2xl border border-orange-500/20 bg-orange-950/25 overflow-hidden">
              <button
                onClick={() => toggleSection('accounts')}
                className="w-full p-3.5 flex items-center justify-between text-right cursor-pointer hover:bg-orange-900/20 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-orange-400" />
                  <span className="text-xs font-bold text-amber-100">الحسابات</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-orange-400 transition-transform ${openSection === 'accounts' ? 'rotate-180' : ''}`}
                />
              </button>

              {openSection === 'accounts' && (
                <div className="p-3 pt-1 border-t border-orange-500/10 space-y-2 bg-[#120400]/40">
                  
                  {/* Visitor Profile Info */}
                  <div className="p-2.5 rounded-xl bg-orange-950/40 text-xs">
                    <span className="text-[10px] text-orange-400/80 block">جلسة الزائر:</span>
                    <span className="font-semibold text-amber-100">ضيف المتجر المميّز</span>
                  </div>

                  {/* Strictly following the user requested path:
                      الإعدادات ← الحسابات ← الإدارة ← تسجيل دخول الإدارة ← زر الدخول برمز دخول */}
                  <div className="pt-2 border-t border-orange-500/10">
                    <div className="text-[11px] font-bold text-orange-300 mb-2 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-orange-400" />
                      <span>الإدارة</span>
                    </div>

                    {!isAdminLoggedIn ? (
                      <div className="space-y-2">
                        {adminStep === 0 ? (
                          <button
                            onClick={() => setAdminStep(1)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-medium text-orange-300/80 bg-orange-950/30 hover:bg-orange-900/40 border border-orange-500/15 flex items-center justify-between cursor-pointer"
                          >
                            <span>تسجيل دخول الإدارة</span>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="p-3 rounded-2xl bg-orange-950/60 border border-orange-500/25 space-y-2.5 animate-in fade-in duration-150">
                            <span className="text-[11px] text-orange-200 block">
                              بوابة دخول أعضاء الإدارة:
                            </span>
                            <button
                              onClick={() => {
                                setIsSettingsDrawerOpen(false);
                                setIsAdminLoginOpen(true);
                              }}
                              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <KeyRound className="w-3.5 h-3.5" />
                              <span>زر الدخول برمز دخول</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Admin is logged in */
                      <div className="p-3 rounded-2xl bg-orange-950/60 border border-orange-500/30 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <Check className="w-4 h-4" />
                          <span>أنت مسجل كمدير للمتجر</span>
                        </div>

                        <button
                          onClick={() => {
                            setIsSettingsDrawerOpen(false);
                            setIsAdminDashboardOpen(true);
                          }}
                          className="w-full py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>فتح لوحة تحكم الإدارة</span>
                        </button>

                        <button
                          onClick={logoutAdmin}
                          className="w-full py-1.5 px-3 rounded-xl text-xs font-medium text-red-300 hover:text-red-200 bg-red-950/30 hover:bg-red-900/40 border border-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>تسجيل الخروج من الإدارة</span>
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Static Pages Modal for Policies */}
      <StaticPagesModal
        pageType={staticPageModal}
        onClose={() => setStaticPageModal(null)}
      />
    </>
  );
};
