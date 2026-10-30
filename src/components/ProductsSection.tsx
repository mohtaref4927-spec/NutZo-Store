import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext.js';
import { ProductCard } from './ProductCard.js';
import { Search, Filter, Sparkles, PlusCircle } from 'lucide-react';

export const ProductsSection: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    isAdminLoggedIn,
    setIsAdminDashboardOpen,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = product.name.toLowerCase().includes(q);
          const matchDesc = product.description.toLowerCase().includes(q);
          const matchCat = product.category.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchCat) return false;
        }

        // Category
        if (selectedCategoryFilter && selectedCategoryFilter !== 'all') {
          if (product.category !== selectedCategoryFilter) return false;
        }

        // Availability
        if (onlyAvailable && !product.isAvailable) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountedPrice ?? a.originalPrice;
        const priceB = b.discountedPrice ?? b.originalPrice;

        if (sortBy === 'price_asc') return priceA - priceB;
        if (sortBy === 'price_desc') return priceB - priceA;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, searchQuery, selectedCategoryFilter, onlyAvailable, sortBy]);

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قائمة المنتجات المميزة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-50">
            تصفح جميع المنتجات
          </h2>
        </div>

        {/* Quick count & Admin Shortcut */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-orange-200/70 font-mono bg-orange-950/40 border border-orange-500/20 px-3 py-1 rounded-lg">
            {filteredProducts.length} منتج
          </span>

          {isAdminLoggedIn && (
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>إضافة منتج</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#200a01]/80 to-[#140600]/80 border border-orange-500/20 backdrop-blur-md mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400/80" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم المنتج أو الوصف..."
            className="w-full pr-9 pl-4 py-2 rounded-xl text-xs sm:text-sm bg-orange-950/40 border border-orange-500/25 text-amber-50 placeholder-orange-300/40 focus:outline-none focus:border-orange-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-orange-400 hover:text-white"
            >
              مسح
            </button>
          )}
        </div>

        {/* Filter Tabs & Sort Selection */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Availability Toggle */}
          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              onlyAvailable
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-orange-950/30 text-orange-300/80 border-orange-500/20 hover:text-white'
            }`}
          >
            المتوفر فقط
          </button>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-orange-950/40 border border-orange-500/25 text-amber-200 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="newest">الأحدث أولاً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar (if categories exist) */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategoryFilter(null)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryFilter === null || selectedCategoryFilter === 'all'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-950/60'
                : 'bg-orange-950/30 text-orange-200/80 border border-orange-500/20 hover:text-white hover:bg-orange-900/40'
            }`}
          >
            جميع الأقسام
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryFilter === cat.name;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryFilter(cat.name)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm shadow-orange-950/60'
                    : 'bg-orange-950/30 text-orange-200/80 border border-orange-500/20 hover:text-white hover:bg-orange-900/40'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Product Grid or Zero State */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 text-center rounded-3xl bg-orange-950/20 border border-orange-500/20 backdrop-blur-md max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center mx-auto mb-4 text-orange-400">
            <Filter className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-amber-100">
            {products.length === 0 ? 'المتجر قيد التجهيز حالياً' : 'لم نجد أي منتجات تطابق بحثك'}
          </h3>

          <p className="text-xs text-orange-300/70 mt-2 leading-relaxed max-w-md mx-auto">
            {products.length === 0
              ? 'لم تتم إضافة أي منتجات بعد في المتجر. يمكنك إضافة أول منتج عبر لوحة الإدارة وسيظهر فوراً لجميع الزوار.'
              : 'جرب تعديل كلمات البحث أو إزالة الفلاتر المحددة لعرض المنتجات الأخرى.'}
          </p>

          {products.length === 0 && isAdminLoggedIn && (
            <button
              onClick={() => setIsAdminDashboardOpen(true)}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 shadow-md hover:from-orange-500 hover:to-amber-500 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة أول منتج الآن</span>
            </button>
          )}
        </div>
      )}
    </section>
  );
};
