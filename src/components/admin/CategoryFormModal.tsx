import React, { useState } from 'react';
import type { Category } from '../../types/store.js';
import { api } from '../../lib/api.js';
import { X } from 'lucide-react';

interface CategoryFormModalProps {
  category?: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  category,
  onClose,
  onSaved,
}) => {
  const isEditing = !!category;
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [order, setOrder] = useState(category?.order?.toString() || '0');
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('يرجى إدخال اسم التصنيف');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);
      await api.saveCategory({
        id: category?.id,
        name: name.trim(),
        description: description.trim(),
        order: Number(order) || 0,
      });
      onSaved();
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل حفظ التصنيف');
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
          {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
        </h3>
        <p className="text-xs text-orange-200/70 mb-4">
          أضف تصنيفاً لترتيب المنتجات وفقاً له وتسهيل التصفح للعملاء.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              اسم التصنيف <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: اشتراكات، حسابات، ألعاب..."
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              وصف مختصر للتصنيف
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="وصف للخدمات التي يقدمها هذا القسم..."
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              ترتيب الظهور (رقم)
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-50"
            />
          </div>

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
              {isSaving ? 'جاري الحفظ...' : isEditing ? 'تحديث التصنيف' : 'حفظ التصنيف'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
