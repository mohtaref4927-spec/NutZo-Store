import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { Star, MessageSquarePlus, ShieldCheck, User } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, setIsAddReviewOpen } = useStore();

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '0.0';

  // Star breakdown calculation
  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
    percentage: totalReviews > 0 ? (reviews.filter((r) => r.rating === s).length / totalReviews) * 100 : 0
  }));

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return '';
    }
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold mb-1">
            <Star className="w-3.5 h-3.5 fill-orange-400" />
            <span>آراء العملاء الحقيقية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
            تقييمات وتجارب المتجر
          </h2>
          <p className="text-xs text-orange-200/70 mt-1">
            جميع التقييمات من عملائنا ومحفوظة بشكل دائم على الخادم.
          </p>
        </div>

        <button
          onClick={() => setIsAddReviewOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/80 transition-all cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>أضف تقييمك الآن</span>
        </button>
      </div>

      {/* Ratings Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#220c02]/90 to-[#140600]/95 border border-orange-500/25 backdrop-blur-md mb-8">
        
        {/* Score Column */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-l border-orange-500/20">
          <div className="text-5xl font-black text-amber-300 font-mono tracking-tight">
            {averageRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs text-orange-300/80 font-medium">
            بناءً على {totalReviews} تقييم مسجل
          </span>
        </div>

        {/* Breakdown Bars Column */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          {starCounts.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-orange-300 font-bold font-mono text-left">
                {stars} نجوم
              </span>
              <div className="flex-1 h-2 rounded-full bg-orange-950/80 border border-orange-500/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-8 text-orange-400/80 font-mono text-right text-[11px]">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col justify-between p-5 rounded-2xl bg-orange-950/25 border border-orange-500/20 backdrop-blur-sm"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-300">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-amber-100">
                      {rev.authorName}
                    </span>
                  </div>

                  <span className="text-[10px] text-orange-400/70 font-mono">
                    {formatDate(rev.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-700'
                      }`}
                    />
                  ))}
                </div>

                <p className="text-xs text-orange-200/80 leading-relaxed whitespace-pre-line">
                  {rev.comment}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-orange-500/10 flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium">
                <ShieldCheck className="w-3 h-3" />
                <span>تقييم موثق</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-3xl bg-orange-950/20 border border-orange-500/20 backdrop-blur-md max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-4 text-orange-400">
            <Star className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-amber-100">
            لا توجد تقييمات مضافة بعد
          </h3>

          <p className="text-xs text-orange-300/70 mt-2 leading-relaxed max-w-md mx-auto">
            كن أول من يقيّم متجر نوتزو ويشارك تجربته مع الآخرين!
          </p>

          <button
            onClick={() => setIsAddReviewOpen(true)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md hover:from-orange-500 hover:to-amber-500 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>كتابة أول تقييم</span>
          </button>
        </div>
      )}
    </section>
  );
};
