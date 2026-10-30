import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { api } from '../lib/api.js';
import { Edit3, Check, X, LayoutDashboard, Sparkles, Save } from 'lucide-react';

export const VisualEditorToolbar: React.FC = () => {
  const {
    isVisualEditorActive,
    setIsVisualEditorActive,
    setIsAdminDashboardOpen,
    settings,
    refreshStoreData,
  } = useStore();

  const [activeEditModal, setActiveEditModal] = useState<boolean>(false);
  const [taglineInput, setTaglineInput] = useState(settings?.tagline || '');
  const [descInput, setDescInput] = useState(settings?.description || '');
  const [purchaseMsgInput, setPurchaseMsgInput] = useState(settings?.purchaseMessage || '');
  const [privacyInput, setPrivacyInput] = useState(settings?.policies?.privacyPolicy || '');
  const [termsInput, setTermsInput] = useState(settings?.policies?.termsOfService || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isVisualEditorActive) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateSettings({
        tagline: taglineInput,
        description: descInput,
        purchaseMessage: purchaseMsgInput,
        policies: {
          privacyPolicy: privacyInput,
          termsOfService: termsInput,
          aboutUs: settings?.policies?.aboutUs || '',
        },
      });
      await refreshStoreData();
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setActiveEditModal(false);
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('فشل حفظ التعديلات');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Floating Top Editor Bar */}
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-2xl bg-gradient-to-r from-orange-950 via-[#260e02] to-orange-950 border-2 border-amber-500/80 rounded-2xl shadow-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-amber-50 backdrop-blur-xl animate-in slide-in-from-top duration-200" dir="rtl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <Edit3 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-black text-amber-200">
              وضع التحديد والتعديل المباشر
            </h4>
            <p className="text-[10px] text-orange-200/80">
              يمكنك تعديل أي نص أو زر أو سياسة وحفظها فورياً
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveEditModal(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تعديل العناصر</span>
          </button>

          <button
            onClick={() => {
              setIsVisualEditorActive(false);
              setIsAdminDashboardOpen(true);
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-orange-200 bg-orange-900/60 hover:bg-orange-800 border border-orange-500/30 cursor-pointer flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>لوحة الإدارة</span>
          </button>

          <button
            onClick={() => setIsVisualEditorActive(false)}
            className="p-1.5 rounded-xl bg-orange-950 hover:bg-orange-900 text-orange-400 hover:text-white cursor-pointer"
            title="إنهاء وضع التعديل"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Modal */}
      {activeEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
          <div 
            className="relative w-full max-w-xl rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#250d02] via-[#1a0800] to-[#120400] border border-orange-500/40 shadow-2xl text-amber-50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveEditModal(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 text-orange-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-amber-100 mb-1 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>تعديل نصوص وعناصر المتجر</span>
            </h3>
            <p className="text-xs text-orange-200/70 mb-4">
              أي تعديل تقوم به هنا يُحفظ مباشرة في قاعدة البيانات ويظهر لجميع الزوار.
            </p>

            {savedSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>تم حفظ التعديلات بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  العبارة الرئيسية (Tagline)
                </label>
                <input
                  type="text"
                  value={taglineInput}
                  onChange={(e) => setTaglineInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/30 text-amber-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  وصف الصفحة الرئيسية
                </label>
                <textarea
                  rows={3}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/30 text-amber-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  رسالة إكمال الشراء (Discord Message)
                </label>
                <textarea
                  rows={2}
                  value={purchaseMsgInput}
                  onChange={(e) => setPurchaseMsgInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/30 text-amber-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  سياسة الخصوصية
                </label>
                <textarea
                  rows={3}
                  value={privacyInput}
                  onChange={(e) => setPrivacyInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/30 text-amber-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-orange-300 mb-1">
                  شروط الاستخدام والضمان
                </label>
                <textarea
                  rows={3}
                  value={termsInput}
                  onChange={(e) => setTermsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/30 text-amber-100 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEditModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-orange-300 bg-orange-950 hover:bg-orange-900 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التعديلات في الخادم'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
