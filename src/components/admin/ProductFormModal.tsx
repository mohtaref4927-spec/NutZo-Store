import React, { useState } from 'react';
import type { Product, Category } from '../../types/store.js';
import { api } from '../../lib/api.js';
import { X, Upload, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ProductFormModalProps {
  product?: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  categories,
  onClose,
  onSaved,
}) => {
  const isEditing = !!product;

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [category, setCategory] = useState(product?.category || (categories[0]?.name || ''));
  const [customCategory, setCustomCategory] = useState('');
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice?.toString() || '');
  const [discountedPrice, setDiscountedPrice] = useState(product?.discountedPrice?.toString() || '');
  const [isAvailable, setIsAvailable] = useState(product ? product.isAvailable : true);
  const [isHidden, setIsHidden] = useState(product ? product.isHidden : false);
  const [mainImage, setMainImage] = useState(product?.mainImage || '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg');
  const [extraImages, setExtraImages] = useState<string[]>(product?.extraImages || []);
  const [newExtraUrl, setNewExtraUrl] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isExtra = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadedUrl = await api.uploadImage(base64, file.name);
          if (isExtra) {
            setExtraImages((prev) => [...prev, uploadedUrl]);
          } else {
            setMainImage(uploadedUrl);
          }
        } catch (err: any) {
          setErrorMsg(err?.message || 'فشل حفظ الصورة على السيرفر');
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
    }
  };

  const handleAddExtraUrl = () => {
    if (newExtraUrl.trim()) {
      setExtraImages((prev) => [...prev, newExtraUrl.trim()]);
      setNewExtraUrl('');
    }
  };

  const handleRemoveExtraImage = (index: number) => {
    setExtraImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !originalPrice) {
      setErrorMsg('يرجى ملء اسم المنتج وسعره الأصلي');
      return;
    }

    const orig = Number(originalPrice);
    const disc = discountedPrice ? Number(discountedPrice) : undefined;
    let discPercent: number | undefined;

    if (disc && disc < orig) {
      discPercent = Math.round(((orig - disc) / orig) * 100);
    }

    const finalCategory = (customCategory.trim() || category || 'عام').trim();

    try {
      setIsSaving(true);
      setErrorMsg(null);

      await api.saveProduct({
        id: product?.id,
        name: name.trim(),
        description: description.trim(),
        category: finalCategory,
        originalPrice: orig,
        discountedPrice: disc,
        discountPercent: discPercent,
        isAvailable,
        isHidden,
        mainImage,
        extraImages,
      });

      onSaved();
    } catch (err: any) {
      setErrorMsg(err?.message || 'فشل حفظ المنتج');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-2xl rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-[#250d02] via-[#1a0800] to-[#110400] border border-orange-500/35 shadow-2xl shadow-orange-950/90 text-amber-50 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-xl font-black text-amber-100 mb-1">
          {isEditing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h3>
        <p className="text-xs text-orange-200/70 mb-5">
          المنتج المحفوظ يظهر فوراً لجميع زوار المتجر مع حفظه الدائم في السيرفر.
        </p>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/30 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              اسم المنتج <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: اشتراك شهر بريميوم"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1">
              وصف وتفاصيل المنتج
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مميزات المنتج، مدة التسليم، طريقة التفعيل..."
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/50 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                اختر التصنيف
              </label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCustomCategory('');
                }}
                className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-100"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
                <option value="">+ إضافة تصنيف جديد</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                أو اكتب اسم تصنيف جديد
              </label>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="مثال: أدوات خاصة، مفاتيح..."
                className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-100 placeholder-orange-300/40"
              />
            </div>
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                السعر الأصلي (ريال) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="مثال: 50"
                className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-100"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-orange-300 mb-1">
                السعر بعد الخصم (اختياري - يظهر السعر القديم بالأحمر مشطوباً)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                placeholder="مثال: 25"
                className="w-full px-3.5 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-100"
              />
            </div>
          </div>

          {/* Main Image Upload & Preview */}
          <div className="p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/20 space-y-2.5">
            <label className="block text-xs font-bold text-orange-300">
              صورة المنتج الرئيسية (حفظ دائم بالسيرفر)
            </label>

            <div className="flex items-center gap-3">
              <img
                src={mainImage}
                alt="معاينة"
                className="w-16 h-16 rounded-xl object-cover bg-black border border-orange-500/20 shrink-0"
              />

              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-700 hover:bg-orange-600 text-white cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'جاري الرفع...' : 'رفع صورة من جهازك'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, false)}
                    className="hidden"
                  />
                </label>

                <input
                  type="text"
                  value={mainImage}
                  onChange={(e) => setMainImage(e.target.value)}
                  placeholder="أو ضع رابط صورة مباشر"
                  className="w-full px-3 py-1.5 rounded-xl text-[11px] bg-orange-950/50 border border-orange-500/20 text-amber-100"
                />
              </div>
            </div>
          </div>

          {/* Extra Images */}
          <div className="p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-orange-300">
                صور إضافية للمنتج (معرض الصور)
              </label>
              <label className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>رفع صورة إضافية</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, true)}
                  className="hidden"
                />
              </label>
            </div>

            {/* List */}
            {extraImages.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {extraImages.map((img, idx) => (
                  <div key={idx} className="relative group shrink-0">
                    <img src={img} alt="" className="w-12 h-12 rounded-lg object-cover border border-orange-500/20" />
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraImage(idx)}
                      className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-600 text-white hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles: Availability & Hidden */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-orange-950/40 border border-orange-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-xs font-semibold text-amber-100">المنتج متوفر للطلب</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-orange-950/40 border border-orange-500/20 cursor-pointer">
              <input
                type="checkbox"
                checked={isHidden}
                onChange={(e) => setIsHidden(e.target.checked)}
                className="w-4 h-4 text-orange-600 rounded"
              />
              <span className="text-xs font-semibold text-amber-100">إخفاء المنتج عن الزوار</span>
            </label>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2 pt-3 border-t border-orange-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-orange-300 bg-orange-950 hover:bg-orange-900 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'جاري الحفظ بالسيرفر...' : isEditing ? 'تحديث المنتج' : 'حفظ ونشر المنتج'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
