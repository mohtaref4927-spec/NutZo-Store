import React from 'react';
import { useStore } from '../context/StoreContext.js';
import { Layers, ArrowLeft, PlusCircle } from 'lucide-react';

export const CategoriesSection: React.FC = () => {
  const { categories, products, setSelectedCategoryFilter, setActivePage, isAdminLoggedIn, setIsAdminDashboardOpen } = useStore();

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setActivePage('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>تصنيفات المتجر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
            أقسام وتصنيفات نوتزو
          </h2>
          <p className="text-xs text-orange-200/70 mt-1">
            اختر التصنيف لاستعراض كافة المنتجات والخدمات المتوفرة ضمنه.
          </p>
        </div>

        {isAdminLoggedIn && (
          <button
            onClick={() => setIsAdminDashboardOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إدارة التصنيفات</span>
          </button>
        )}
      </div>

      {categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.name).length;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className="group relative flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-b from-[#220c02]/85 to-[#150600]/95 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-950/60 cursor-pointer backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-300/80 bg-orange-950/50 border border-orange-500/20 px-2.5 py-1 rounded-lg">
                      {count} منتج
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-amber-50 group-hover:text-amber-200 transition-colors">
                    {cat.name}
                  </h3>

                  {cat.description && (
                    <p className="text-xs text-orange-200/60 mt-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-orange-500/15 flex items-center justify-between text-xs font-semibold text-orange-400 group-hover:text-amber-200 transition-colors">
                  <span>استعراض المنتجات</span>
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-3xl bg-orange-950/20 border border-orange-500/20 backdrop-blur-md max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-4 text-orange-400">
            <Layers className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-amber-100">
            لا توجد تصنيفات مضافة حالياً
          </h3>

          <p className="text-xs text-orange-300/70 mt-2 leading-relaxed max-w-md mx-auto">
            يمكن للمدير إضافة أي تصنيف بحرية تامة من لوحة الإدارة وربط المنتجات به.
          </p>

          <button
            onClick={() => {
              setActivePage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md hover:from-orange-500 hover:to-amber-500 cursor-pointer"
          >
            <span>عرض كل المنتجات</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};
