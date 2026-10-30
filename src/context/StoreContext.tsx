import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, Category, Review, CartItem, StoreSettings, ActivePage, DiscountCode } from '../types/store.js';
import { api } from '../lib/api.js';

interface StoreContextType {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  products: Product[];
  categories: Category[];
  reviews: Review[];
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshStoreData: () => Promise<void>;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Coupon
  appliedCoupon: string | null;
  discountAmount: number;
  couponMessage: string | null;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCouponCode: () => void;

  // Modals & Drawers
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isDiscordCheckoutOpen: boolean;
  setIsDiscordCheckoutOpen: (open: boolean) => void;
  isHowToOrderOpen: boolean;
  setIsHowToOrderOpen: (open: boolean) => void;
  isSettingsDrawerOpen: boolean;
  setIsSettingsDrawerOpen: (open: boolean) => void;
  isAdminLoginOpen: boolean;
  setIsAdminLoginOpen: (open: boolean) => void;
  isAdminDashboardOpen: boolean;
  setIsAdminDashboardOpen: (open: boolean) => void;
  isAddReviewOpen: boolean;
  setIsAddReviewOpen: (open: boolean) => void;

  // Admin state
  isAdminLoggedIn: boolean;
  loginAdmin: (pin: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;

  // Visual Editor Mode ("تحديد وتعديل")
  isVisualEditorActive: boolean;
  setIsVisualEditorActive: (active: boolean) => void;
  updateCustomText: (key: string, value: string) => Promise<void>;

  // Selected Category filter helper
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nutzo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Discount
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDiscordCheckoutOpen, setIsDiscordCheckoutOpen] = useState(false);
  const [isHowToOrderOpen, setIsHowToOrderOpen] = useState(false);
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);

  // Admin status
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Visual Editor Mode
  const [isVisualEditorActive, setIsVisualEditorActive] = useState(false);

  // Category filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Persist cart to localStorage for shopper convenience
  useEffect(() => {
    try {
      localStorage.setItem('nutzo_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  // Load store data
  const refreshStoreData = useCallback(async () => {
    try {
      setError(null);
      const data = await api.getStoreData();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setReviews(data.reviews || []);
      setSettings(data.settings);
    } catch (err: any) {
      console.error('Failed to load store data:', err);
      setError(err?.message || 'تعذر تحميل بيانات المتجر');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check admin session on initial mount
  useEffect(() => {
    refreshStoreData();
    api.adminVerify().then(isValid => {
      setIsAdminLoggedIn(isValid);
    });
  }, [refreshStoreData]);

  // Cart Actions
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product.discountedPrice ?? item.product.originalPrice;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Coupon Action
  const applyCouponCode = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    try {
      const res = await api.validateCoupon(code, cartSubtotal);
      if (res.valid) {
        setAppliedCoupon(code.toUpperCase());
        setDiscountAmount(res.discountAmount);
        setCouponMessage(res.message);
        return true;
      } else {
        setCouponMessage(res.message);
        return false;
      }
    } catch (err: any) {
      setCouponMessage(err?.message || 'فشل التحقق من كود الخصم');
      return false;
    }
  };

  const removeCouponCode = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponMessage(null);
  };

  // Admin Login / Logout
  const loginAdmin = async (pin: string) => {
    await api.adminLogin(pin);
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const logoutAdmin = async () => {
    await api.adminLogout();
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
    setIsVisualEditorActive(false);
  };

  // Visual Editor Text Update
  const updateCustomText = async (key: string, value: string) => {
    if (!settings) return;
    const newCustomTexts = { ...(settings.customTexts || {}), [key]: value };
    const updatedSettings = await api.updateSettings({ customTexts: newCustomTexts });
    setSettings(updatedSettings);
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        products,
        categories,
        reviews,
        settings,
        isLoading,
        error,
        refreshStoreData,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        appliedCoupon,
        discountAmount,
        couponMessage,
        applyCouponCode,
        removeCouponCode,
        selectedProduct,
        setSelectedProduct,
        isDiscordCheckoutOpen,
        setIsDiscordCheckoutOpen,
        isHowToOrderOpen,
        setIsHowToOrderOpen,
        isSettingsDrawerOpen,
        setIsSettingsDrawerOpen,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        isAdminDashboardOpen,
        setIsAdminDashboardOpen,
        isAddReviewOpen,
        setIsAddReviewOpen,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        isVisualEditorActive,
        setIsVisualEditorActive,
        updateCustomText,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
