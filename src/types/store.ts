export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  originalPrice: number;
  discountedPrice?: number;
  discountPercent?: number;
  discountCode?: string;
  isAvailable: boolean;
  isHidden: boolean;
  mainImage: string;
  extraImages: string[];
  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  order: number;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  isHidden: boolean;
  createdAt: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number; // percentage (e.g. 20) or fixed amount in SAR
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerDiscord: string;
  customerNotes?: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  finalTotal: number;
  discountCode?: string;
  paymentMethod: 'bank_transfer';
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  iban: string;
  logoText?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  description: string;
  discordUrl: string;
  logoUrl: string;
  bannerUrl: string;
  purchaseMessage: string;
  bankDetails: {
    alRajhi: BankAccount;
    snb: BankAccount;
    riyad: BankAccount;
  };
  policies: {
    privacyPolicy: string;
    termsOfService: string;
    aboutUs: string;
  };
  customTexts?: Record<string, string>;
}

export type ActivePage = 'home' | 'products' | 'categories' | 'reviews' | 'faq' | 'bank_transfer' | 'privacy' | 'terms';
