import React, { useState } from 'react';
import type { DiscountCode } from '../../types/store.js';
import { api } from '../../lib/api.js';
import { X } from 'lucide-react';

interface DiscountFormModalProps {
  coupon?: DiscountCode | null;
  onClose: () => void;
  onSaved: () => void;
}

export const DiscountFormModal: React.FC<DiscountFormModalProps> = ({
  coupon,
  onClose,
  onSaved,
}) => {
  const isEditing = !!coupon;
  const [code, setCode] = useState(coupon?.code || '');
  const [type, setType] = useState<'percent' | 'fixed'>(coupon?.type || 'percent');
  const [value, setValue] = useState(coupon?.value?.toString() || '');
  const [maxUses, setMaxUses] = useState(coupon?.maxUses?.toString() || '0');
  const [expiryDate, setExpiryDate] = useState(coupon?.expiryDate || '');
  const [isActive, setIsActive] = useState(coupon ? coupon.isActive : true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) {
      setErrorMsg('يرجى إدخال رمز الكود وقيمة الخصم');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await api.saveCoupon({
        id: coupon?.id,
        code: code.trim().toUpperCase(),
        type,
        value: Number(value),
        maxUses: Number(maxUses) || 0,
        currentUses: coupon?.currentUses || 0,
        expiryDate,
        isActive,
      });
      onSaved();
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل حفظ كود الخصم');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" dir="rtl">
      <div 
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#250d02] via-[#1a0800] to-[#110400] border border-orange-500/35 shadow-2xl text-amber-50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-black text-amber-100 mb-1">
          {isEditing ? 'تعديل كود الخصم' : 'إنشاء كود خصم جديد'}
        </h3>
        <p className="text-xs text-orange-200/70 mb-4">
          يستطيع الزوار إدخال الكود في السلة للحصول على الخصم فوراً.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              رمز الكود <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="مثال: NUTZO20 أو RAMADAN"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono uppercase bg-orange-950/50 border border-orange-500/25 text-amber-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                نوع الخصم
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-100"
              >
                <option value="percent">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت (ريال)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                قيمة الخصم <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={type === 'percent' ? 'مثال: 15' : 'مثال: 20'}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                أقصى مرات استخدام (0 غير محدود)
              </label>
              <input
                type="number"
                min="0"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                تاريخ الانتهاء (اختياري)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 p-3 rounded-xl bg-orange-950/40 border border-orange-500/20 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="text-xs font-semibold text-amber-100">الكود نشط ومفعل حالياً</span>
          </label>

          <div className="flex justify-end gap-2 pt-2 border-t border-orange-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-orange-300 bg-orange-950 hover:bg-orange-900"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ...' : isEditing ? 'تحديث الكود' : 'حفظ الكود'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
