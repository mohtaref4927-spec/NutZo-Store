import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { X, Lock, KeyRound, ShieldAlert } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminLoginOpen, setIsAdminLoginOpen, loginAdmin } = useStore();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isAdminLoginOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);
      await loginAdmin(pin);
      setPin('');
    } catch (err: any) {
      setErrorMsg(err?.message || 'رمز الدخول غير صحيح، يرجى المحاولة ثانية.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
      <div 
        className="relative w-full max-w-sm rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#250d02] via-[#1a0800] to-[#120400] border border-orange-500/35 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => {
            setIsAdminLoginOpen(false);
            setErrorMsg(null);
            setPin('');
          }}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mb-3 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-black text-amber-100">
            لجنة الإدارة - NUTZO STORE
          </h3>
          <p className="text-xs text-orange-300/70 mt-1">
            منطقة محمية. أدخل رمز الإدارة السري للوصول للوحة التحكم.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs font-medium flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1.5">
              رمز الإدارة
            </label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/80" />
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••••"
                className="w-full pr-9 pl-3 py-2.5 rounded-xl text-center font-mono text-base tracking-widest bg-orange-950/50 border border-orange-500/30 text-amber-100 placeholder-orange-400/30 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'جاري التحقق في الخادم...' : 'دخول إلى لوحة التحكم'}
          </button>
        </form>
      </div>
    </div>
  );
};
