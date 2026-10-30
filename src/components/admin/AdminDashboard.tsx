import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext.js';
import { api } from '../../lib/api.js';
import type { Product, Category, Review, DiscountCode, Order, StoreSettings } from '../../types/store.js';
import { ProductFormModal } from './ProductFormModal.js';
import { CategoryFormModal } from './CategoryFormModal.js';
import { DiscountFormModal } from './DiscountFormModal.js';
import {
  X,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  Star,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  LogOut,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Edit3,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminDashboardOpen,
    setIsAdminDashboardOpen,
    logoutAdmin,
    refreshStoreData,
    setIsVisualEditorActive,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'coupons' | 'orders' | 'reviews' | 'settings'>('products');
  const [adminData, setAdminData] = useState<{
    products: Product[];
    categories: Category[];
    reviews: Review[];
    discountCodes: DiscountCode[];
    orders: Order[];
    settings: StoreSettings;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  // Sub-modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState<DiscountCode | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Delete Confirmation Modal
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'product' | 'category' | 'coupon' | 'review';
    id: string;
    title: string;
  } | null>(null);

  // Settings tab form states
  const [settingsForm, setSettingsForm] = useState<StoreSettings | null>(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAdminAllData();
      setAdminData(data);
      setSettingsForm(data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminDashboardOpen) {
      fetchAdminData();
    }
  }, [isAdminDashboardOpen]);

  if (!isAdminDashboardOpen) return null;

  // Visual Editor trigger ("تحديد وتعديل")
  const handleLaunchVisualEditor = () => {
    setIsAdminDashboardOpen(false);
    setIsVisualEditorActive(true);
  };

  // Delete Confirm Action
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    try {
      if (deleteConfirm.type === 'product') {
        await api.deleteProduct(deleteConfirm.id);
      } else if (deleteConfirm.type === 'category') {
        await api.deleteCategory(deleteConfirm.id);
      } else if (deleteConfirm.type === 'coupon') {
        await api.deleteCoupon(deleteConfirm.id);
      } else if (deleteConfirm.type === 'review') {
        await api.deleteReview(deleteConfirm.id);
      }
      setDeleteConfirm(null);
      await fetchAdminData();
      await refreshStoreData();
    } catch (err: any) {
      alert(err?.message || 'فشل الحذف');
    }
  };

  // Product Toggle Visibility
  const handleToggleProduct = async (id: string) => {
    await api.toggleProductVisibility(id);
    await fetchAdminData();
    await refreshStoreData();
  };

  // Review Toggle Visibility
  const handleToggleReview = async (id: string) => {
    await api.toggleReviewVisibility(id);
    await fetchAdminData();
    await refreshStoreData();
  };

  // Order Status update
  const handleOrderStatus = async (id: string, status: Order['status']) => {
    await api.updateOrderStatus(id, status);
    await fetchAdminData();
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;
    try {
      setIsSavingSettings(true);
      await api.updateSettings(settingsForm);
      await fetchAdminData();
      await refreshStoreData();
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 2500);
    } catch (err: any) {
      alert(err?.message || 'فشل حفظ الإعدادات');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const products = adminData?.products || [];
  const categories = adminData?.categories || [];
  const reviews = adminData?.reviews || [];
  const discountCodes = adminData?.discountCodes || [];
  const orders = adminData?.orders || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div 
        className="relative w-full max-w-6xl h-[92vh] rounded-3xl bg-gradient-to-b from-[#220c02] via-[#160600] to-[#0e0300] border border-orange-500/35 shadow-2xl flex flex-col text-amber-50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar of Dashboard */}
        <div className="p-4 sm:px-6 sm:py-4 border-b border-orange-500/20 bg-[#160500] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-amber-100">
                لوحة تحكم إدارة المتجر
              </h2>
              <span className="text-[11px] text-orange-400 font-mono">
                NUTZO STORE · قاعدة بيانات خادم دائمة
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Visual Drag & In-Place Editor Trigger button */}
            <button
              onClick={handleLaunchVisualEditor}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              title="تحديد وتعديل أي عنصر بالموقع"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تحديد وتعديل</span>
            </button>

            <button
              onClick={fetchAdminData}
              className="p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 cursor-pointer"
              title="تحديث البيانات"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={logoutAdmin}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>

            <button
              onClick={() => setIsAdminDashboardOpen(false)}
              className="p-2 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 hover:text-white border border-orange-500/20 cursor-pointer"
              aria-label="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 border-b border-orange-500/15 bg-orange-950/30 overflow-x-auto scrollbar-none shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'products'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>المنتجات ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'categories'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>التصنيفات ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'coupons'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>أكواد الخصم ({discountCodes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'orders'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>الطلبات ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'reviews'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>التقييمات ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeTab === 'settings'
                ? 'bg-orange-600/30 text-amber-200 border border-orange-500/40 shadow-sm'
                : 'text-orange-200/70 hover:text-white hover:bg-orange-900/30'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>إعدادات المتجر والسياسات</span>
          </button>
        </div>

        {/* Dashboard Main Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-xs text-orange-300">
              جاري مزامنة بيانات السيرفر...
            </div>
          ) : (
            <>
              {/* TAB 1: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        إدارة المنتجات
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        يمكنك إضافة منتج جديد، تعديل الأسعار، تغيير الصور، أو إخفاء المنتج مؤقتاً.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsProductModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة منتج جديد</span>
                    </button>
                  </div>

                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex gap-3 p-3.5 rounded-2xl bg-orange-950/30 border border-orange-500/20"
                        >
                          <img
                            src={prod.mainImage}
                            alt=""
                            className="w-20 h-20 rounded-xl object-cover bg-black border border-orange-500/20 shrink-0"
                          />
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] text-orange-400 font-semibold">{prod.category}</span>
                                {prod.isHidden && (
                                  <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                                    مخفي
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs font-bold text-amber-100 line-clamp-1">{prod.name}</h4>
                              <div className="flex items-baseline gap-2 mt-1">
                                {prod.discountedPrice && (
                                  <span className="text-[11px] line-through text-red-400 font-mono">
                                    {prod.originalPrice} ريال
                                  </span>
                                )}
                                <span className="text-xs font-bold text-amber-300 font-mono">
                                  {prod.discountedPrice ?? prod.originalPrice} ريال
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 pt-2 border-t border-orange-500/10 justify-end">
                              <button
                                onClick={() => handleToggleProduct(prod.id)}
                                className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300 hover:text-white"
                                title={prod.isHidden ? 'إظهار للزوار' : 'إخفاء عن الزوار'}
                              >
                                {prod.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300 hover:text-white"
                                title="تعديل المنتج"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  setDeleteConfirm({
                                    type: 'product',
                                    id: prod.id,
                                    title: prod.name,
                                  })
                                }
                                className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white"
                                title="حذف المنتج"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center p-6 rounded-2xl bg-orange-950/20 border border-orange-500/15">
                      <p className="text-xs text-orange-300">لا توجد منتجات مسجلة حتى الآن. ابدأ بإضافة أول منتج!</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        إدارة الأقسام والتصنيفات
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        أضف تصنيفات مخصصة للمتجر لربط أي منتج بها بكل حرية.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCategory(null);
                        setIsCategoryModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة تصنيف جديد</span>
                    </button>
                  </div>

                  {categories.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center justify-between p-4 rounded-2xl bg-orange-950/30 border border-orange-500/20"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-amber-100">{cat.name}</h4>
                            {cat.description && (
                              <p className="text-[11px] text-orange-200/60 line-clamp-1">{cat.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingCategory(cat);
                                setIsCategoryModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'category',
                                  id: cat.id,
                                  title: cat.name,
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center p-6 rounded-2xl bg-orange-950/20 border border-orange-500/15">
                      <p className="text-xs text-orange-300">لا توجد تصنيفات مضافة حتى الآن.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: COUPONS */}
              {activeTab === 'coupons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        أكواد الخصم والكوبونات
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        أنشئ أكواد خصم بنسبة مئوية أو بمبلغ ثابت وحدد سقف الاستخدام.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingCoupon(null);
                        setIsCouponModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إنشاء كود خصم</span>
                    </button>
                  </div>

                  {discountCodes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {discountCodes.map((coup) => (
                        <div
                          key={coup.id}
                          className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/20 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-xs font-black text-amber-300 px-2 py-0.5 rounded bg-orange-900/50 border border-orange-500/30">
                                {coup.code}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${coup.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-900 text-stone-400'}`}>
                                {coup.isActive ? 'نشط' : 'معطل'}
                              </span>
                            </div>
                            <p className="text-xs text-orange-100 font-semibold">
                              الخصم: {coup.type === 'percent' ? `${coup.value}%` : `${coup.value} ريال`}
                            </p>
                            <span className="text-[11px] text-orange-300/70 block mt-1">
                              مرات الاستخدام: {coup.currentUses} / {coup.maxUses === 0 ? 'غير محدود' : coup.maxUses}
                            </span>
                          </div>

                          <div className="mt-4 pt-3 border-t border-orange-500/10 flex justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingCoupon(coup);
                                setIsCouponModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'coupon',
                                  id: coup.id,
                                  title: coup.code,
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center p-6 rounded-2xl bg-orange-950/20 border border-orange-500/15">
                      <p className="text-xs text-orange-300">لا توجد أكواد خصم مسجلة.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        سجل الطلبات المسجلة
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        متابعة الطلبات المحولة للديسكورد وتحديث حالتها.
                      </p>
                    </div>
                  </div>

                  {orders.length > 0 ? (
                    <div className="space-y-3">
                      {orders.map((ord) => (
                        <div
                          key={ord.id}
                          className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-black text-amber-300 bg-orange-900/50 px-2 py-0.5 rounded border border-orange-500/30">
                                {ord.orderNumber}
                              </span>
                              <span className="font-bold text-amber-100">{ord.customerName}</span>
                              {ord.customerDiscord && (
                                <span className="text-orange-400 font-mono text-[11px]">
                                  ({ord.customerDiscord})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-orange-200/70">
                              المنتجات: {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                            </div>
                            {ord.customerNotes && (
                              <p className="text-[11px] text-orange-300/80 italic">
                                ملاحظات: {ord.customerNotes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-black text-amber-300">
                              {ord.finalTotal} ريال
                            </span>

                            <select
                              value={ord.status}
                              onChange={(e) => handleOrderStatus(ord.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-xl text-xs bg-orange-950/60 border border-orange-500/30 text-amber-100 cursor-pointer"
                            >
                              <option value="pending">قيد الانتظار</option>
                              <option value="processing">جاري التنفيذ</option>
                              <option value="completed">مكتمل ومسلّم</option>
                              <option value="cancelled">ملغي</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center p-6 rounded-2xl bg-orange-950/20 border border-orange-500/15">
                      <p className="text-xs text-orange-300">لا توجد طلبات مسجلة حتى الآن.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        مراجعة التقييمات العامة
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        جميع التقييمات حقيقية من الزوار؛ يمكنك إخفاء أي تقييم أو حذفه بشكل دائم.
                      </p>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-3">
                      {reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                        >
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-amber-100">{rev.authorName}</span>
                              <span className="text-amber-400 font-mono">({rev.rating} نجوم)</span>
                              {rev.isHidden && (
                                <span className="text-[9px] bg-red-950 text-red-300 px-1.5 py-0.5 rounded border border-red-500/30">
                                  مخفي عن الزوار
                                </span>
                              )}
                            </div>
                            <p className="text-orange-200/80 leading-relaxed">{rev.comment}</p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleToggleReview(rev.id)}
                              className="p-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900 text-orange-300 hover:text-white"
                              title={rev.isHidden ? 'إظهار التقييم' : 'إخفاء التقييم'}
                            >
                              {rev.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() =>
                                setDeleteConfirm({
                                  type: 'review',
                                  id: rev.id,
                                  title: rev.authorName,
                                })
                              }
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-300 hover:text-white"
                              title="حذف التقييم"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center p-6 rounded-2xl bg-orange-950/20 border border-orange-500/15">
                      <p className="text-xs text-orange-300">لا توجد تقييمات مضافة بعد.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 6: SETTINGS & POLICIES */}
              {activeTab === 'settings' && settingsForm && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-amber-100">
                        إعدادات المتجر والسياسات
                      </h3>
                      <p className="text-xs text-orange-300/70">
                        تعديل النصوص، رابط الديسكورد، سياسة الخصوصية، وشروط الاستخدام.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingSettings}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
                    </button>
                  </div>

                  {settingsSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>تم حفظ كافة إعدادات المتجر بنجاح في قاعدة البيانات!</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-orange-300 mb-1">اسم المتجر</label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-orange-300 mb-1">العبارة الترحيبية</label>
                      <input
                        type="text"
                        value={settingsForm.tagline}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-orange-300 mb-1">رابط سيرفر الديسكورد الرسمي</label>
                    <input
                      type="text"
                      value={settingsForm.discordUrl}
                      onChange={(e) => setSettingsForm({ ...settingsForm, discordUrl: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs font-mono bg-orange-950/50 border border-orange-500/25 text-amber-50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-orange-300 mb-1">وصف الصفحة الرئيسية</label>
                    <textarea
                      rows={2}
                      value={settingsForm.description}
                      onChange={(e) => setSettingsForm({ ...settingsForm, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-orange-300 mb-1">رسالة إكمال الشراء بالديسكورد</label>
                    <textarea
                      rows={2}
                      value={settingsForm.purchaseMessage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, purchaseMessage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-orange-300 mb-1">سياسة الخصوصية</label>
                      <textarea
                        rows={4}
                        value={settingsForm.policies?.privacyPolicy}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            policies: { ...settingsForm.policies, privacyPolicy: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-orange-300 mb-1">شروط الاستخدام والضمان</label>
                      <textarea
                        rows={4}
                        value={settingsForm.policies?.termsOfService}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            policies: { ...settingsForm.policies, termsOfService: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl text-xs bg-orange-950/50 border border-orange-500/25 text-amber-50 resize-none"
                      />
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sub Modals */}
      {isProductModalOpen && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setIsProductModalOpen(false)}
          onSaved={async () => {
            setIsProductModalOpen(false);
            await fetchAdminData();
            await refreshStoreData();
          }}
        />
      )}

      {isCategoryModalOpen && (
        <CategoryFormModal
          category={editingCategory}
          onClose={() => setIsCategoryModalOpen(false)}
          onSaved={async () => {
            setIsCategoryModalOpen(false);
            await fetchAdminData();
            await refreshStoreData();
          }}
        />
      )}

      {isCouponModalOpen && (
        <DiscountFormModal
          coupon={editingCoupon}
          onClose={() => setIsCouponModalOpen(false)}
          onSaved={async () => {
            setIsCouponModalOpen(false);
            await fetchAdminData();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" dir="rtl">
          <div className="w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-[#2b0c01] to-[#140400] border border-red-500/40 text-amber-50">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-black text-amber-100">
              تأكيد عملية الحذف
            </h4>
            <p className="text-xs text-orange-200/80 mt-1 leading-relaxed">
              هل أنت متأكد من رغبتك بحذف: <strong className="text-amber-300">"{deleteConfirm.title}"</strong>؟
              هذا الإجراء سيحذف العنصر نهائياً من قاعدة البيانات لجميع الزوار.
            </p>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl text-xs text-orange-300 bg-orange-950 hover:bg-orange-900 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md cursor-pointer"
              >
                تأكيد الحذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
