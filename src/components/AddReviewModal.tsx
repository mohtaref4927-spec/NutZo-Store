import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.js';
import { api } from '../lib/api.js';
import { X, Star, Send, Sparkles } from 'lucide-react';

export const AddReviewModal: React.FC = () => {
  const { isAddReviewOpen, setIsAddReviewOpen, refreshStoreData } = useStore();
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAddReviewOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setStatusMessage({ type: 'error', text: 'يرجى كتابة نص التقييم' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatusMessage(null);
      await api.submitReview(authorName, rating, comment);
      await refreshStoreData();
      setStatusMessage({ type: 'success', text: 'تم نشر تقييمك بنجاح، شكراً لثقتكم!' });
      setTimeout(() => {
        setIsAddReviewOpen(false);
        setComment('');
        setAuthorName('');
        setStatusMessage(null);
      }, 1200);
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err?.message || 'فشل إرسال التقييم، حاول مجدداً.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#220c02] via-[#170600] to-[#100300] border border-orange-500/30 shadow-2xl shadow-orange-950/90 text-amber-50 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAddReviewOpen(false)}
          className="absolute top-4 left-4 p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 transition-all cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-orange-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>مشاركة رأيك</span>
        </div>
        <h3 className="text-xl font-black text-amber-100">
          إضافة تقييم جديد
        </h3>
        <p className="text-xs text-orange-200/70 mt-1">
          رأيك يهمنا ويساعد الآخرين في اختيار أفضل المنتجات.
        </p>

        {statusMessage && (
          <div className={`mt-4 p-3 rounded-xl text-xs font-medium ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
              : 'bg-red-950/80 text-red-300 border border-red-500/30'
          }`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Star Selection */}
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1.5">
              حدد التقييم
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className="w-7 h-7"
                    fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                    stroke={(hoverRating || rating) >= star ? '#fbbf24' : '#78350f'}
                  />
                </button>
              ))}
              <span className="mr-2 text-xs font-bold text-amber-300 font-mono">
                {rating} من 5 نجوم
              </span>
            </div>
          </div>

          {/* Author Name */}
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1.5">
              اسم العرض
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="مثال: فيصل العتيبي أو اسم مستعار"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/40 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-bold text-orange-300 mb-1.5">
              تعليقك وتجربتك <span className="text-red-400">*</span>
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب تفاصيل تجربتك مع المتجر والخدمة والسرعة..."
              required
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/40 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>جاري الإرسال...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>إرسال التقييم الآن</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
