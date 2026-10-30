import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Product, Category, Review, DiscountCode, Order, StoreSettings } from '../src/types/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, '../data');
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');
const DB_FILE = path.join(DATA_DIR, 'nutzo-store.json');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  reviews: Review[];
  discountCodes: DiscountCode[];
  orders: Order[];
  settings: StoreSettings;
  adminPin: string;
}

const defaultSettings: StoreSettings = {
  storeName: 'NUTZO STORE',
  tagline: 'عالمك الرقمي يبدأ من هنا',
  description: 'مرحبًا بك في متجر نوتزو، وجهتك الأولى لأرقى المنتجات والخدمات مع ضمان وتسليم فوري ودعم فني متميز.',
  discordUrl: 'https://discord.gg/nutzo',
  logoUrl: '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg',
  bannerUrl: '/src/assets/images/nutzo_store_banner_1793324007056.jpg',
  purchaseMessage: 'تنورونا وتشرفونا، لإكمال طلبك يرجى الانتقال إلى سيرفر الديسكورد وفتح تذكرة طلب متجر وتزويدنا بتفاصيل الطلب.',
  bankDetails: {
    alRajhi: {
      bankName: 'مصرف الراجحي',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '482000010928374',
      iban: 'SA4880000482000010928374',
      logoText: 'Al Rajhi'
    },
    snb: {
      bankName: 'البنك الأهلي السعودي (SNB)',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '10928374000192',
      iban: 'SA1210000010928374000192',
      logoText: 'SNB'
    },
    riyad: {
      bankName: 'بنك الرياض',
      accountHolder: 'متجر نوتزو - NUTZO STORE',
      accountNumber: '2938471029384',
      iban: 'SA7720000002938471029384',
      logoText: 'Riyad'
    }
  },
  policies: {
    privacyPolicy: 'نحن في NUTZO STORE نحترم خصوصيتك ونتعهد بحماية كافة البيانات المدخلة في طلباتك ولا نشاركها مع أي طرف ثالث إطلاقاً.',
    termsOfService: 'جميع المشتريات تخضع لسياسة الضمان المعتمدة في سيرفر الديسكورد، ويتم تنفيذ الطلبات وتسليمها فور التحقق من إيصال التحويل البنكي.',
    aboutUs: 'متجر نوتزو هو متجر رقمي متكامل يقدم أفضل الخدمات والمنتجات بجودة عالية وضمان ذهبي مع دعم فني متواصل على مدار الساعة.'
  },
  customTexts: {}
};

class StoreDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          products: parsed.products || [],
          categories: parsed.categories || [],
          reviews: parsed.reviews || [],
          discountCodes: parsed.discountCodes || [],
          orders: parsed.orders || [],
          settings: { ...defaultSettings, ...(parsed.settings || {}) },
          adminPin: parsed.adminPin || '6767'
        };
      }
    } catch (err) {
      console.error('Error loading database, initializing new:', err);
    }

    const initialData: DatabaseSchema = {
      products: [],
      categories: [],
      reviews: [],
      discountCodes: [],
      orders: [],
      settings: defaultSettings,
      adminPin: '6767'
    };
    this.saveData(initialData);
    return initialData;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to disk:', err);
    }
  }

  // Public Getters
  public getPublicData() {
    return {
      products: this.data.products.filter(p => !p.isHidden),
      categories: this.data.categories.sort((a, b) => a.order - b.order),
      reviews: this.data.reviews.filter(r => !r.isHidden).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      settings: this.data.settings
    };
  }

  // Admin getters
  public getAllData() {
    return {
      products: this.data.products,
      categories: this.data.categories,
      reviews: this.data.reviews,
      discountCodes: this.data.discountCodes,
      orders: this.data.orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      settings: this.data.settings
    };
  }

  public verifyAdminPin(pin: string): boolean {
    return pin.trim() === this.data.adminPin.trim();
  }

  // Product operations
  public saveProduct(product: Product): Product {
    const existingIndex = this.data.products.findIndex(p => p.id === product.id);
    const now = new Date().toISOString();

    if (existingIndex >= 0) {
      this.data.products[existingIndex] = {
        ...product,
        updatedAt: now
      };
    } else {
      this.data.products.unshift({
        ...product,
        createdAt: now,
        updatedAt: now
      });
    }
    this.saveData(this.data);
    return product;
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public toggleProductVisibility(id: string): boolean {
    const p = this.data.products.find(p => p.id === id);
    if (p) {
      p.isHidden = !p.isHidden;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Category operations
  public saveCategory(category: Category): Category {
    const idx = this.data.categories.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      this.data.categories[idx] = category;
    } else {
      this.data.categories.push(category);
    }
    this.saveData(this.data);
    return category;
  }

  public deleteCategory(id: string): boolean {
    const prev = this.data.categories.length;
    this.data.categories = this.data.categories.filter(c => c.id !== id);
    if (this.data.categories.length !== prev) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Review operations
  public addReview(authorName: string, rating: number, comment: string): Review {
    const newRev: Review = {
      id: 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      authorName: authorName.trim() || 'عميل نوتزو',
      rating: Math.max(1, Math.min(5, Number(rating) || 5)),
      comment: comment.trim(),
      isHidden: false,
      createdAt: new Date().toISOString()
    };
    this.data.reviews.unshift(newRev);
    this.saveData(this.data);
    return newRev;
  }

  public deleteReview(id: string): boolean {
    const prev = this.data.reviews.length;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);
    if (this.data.reviews.length !== prev) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public toggleReviewVisibility(id: string): boolean {
    const r = this.data.reviews.find(r => r.id === id);
    if (r) {
      r.isHidden = !r.isHidden;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Coupon operations
  public saveDiscountCode(code: DiscountCode): DiscountCode {
    const idx = this.data.discountCodes.findIndex(c => c.id === code.id);
    if (idx >= 0) {
      this.data.discountCodes[idx] = code;
    } else {
      this.data.discountCodes.unshift(code);
    }
    this.saveData(this.data);
    return code;
  }

  public deleteDiscountCode(id: string): boolean {
    const prev = this.data.discountCodes.length;
    this.data.discountCodes = this.data.discountCodes.filter(c => c.id !== id);
    if (this.data.discountCodes.length !== prev) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  public validateCoupon(codeStr: string, currentTotal: number): { valid: boolean; discountAmount: number; message: string } {
    const clean = codeStr.trim().toUpperCase();
    const coupon = this.data.discountCodes.find(c => c.code.toUpperCase() === clean);
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'كود الخصم غير موجود' };
    }
    if (!coupon.isActive) {
      return { valid: false, discountAmount: 0, message: 'كود الخصم معطل حالياً' };
    }
    if (coupon.maxUses > 0 && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, discountAmount: 0, message: 'تم استنفاد عدد مرات استخدام هذا الكود' };
    }
    if (coupon.expiryDate) {
      const exp = new Date(coupon.expiryDate);
      if (exp.getTime() < Date.now()) {
        return { valid: false, discountAmount: 0, message: 'انتهت صلاحية هذا الكود' };
      }
    }

    let discountAmount = 0;
    if (coupon.type === 'percent') {
      discountAmount = Math.round((currentTotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(coupon.value, currentTotal);
    }

    return {
      valid: true,
      discountAmount,
      message: `تم تطبيق خصم ${coupon.type === 'percent' ? coupon.value + '%' : coupon.value + ' ريال'}`
    };
  }

  // Order operations
  public createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>): Order {
    const randNum = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: 'ord_' + Date.now(),
      orderNumber: `NZ-${randNum}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Increment coupon uses if applied
    if (orderData.discountCode) {
      const coupon = this.data.discountCodes.find(c => c.code.toUpperCase() === orderData.discountCode?.toUpperCase());
      if (coupon) {
        coupon.currentUses += 1;
      }
    }

    this.data.orders.unshift(newOrder);
    this.saveData(this.data);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['status']): boolean {
    const order = this.data.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // Settings operations
  public updateSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...newSettings,
      policies: {
        ...this.data.settings.policies,
        ...(newSettings.policies || {})
      },
      bankDetails: {
        ...this.data.settings.bankDetails,
        ...(newSettings.bankDetails || {})
      },
      customTexts: {
        ...this.data.settings.customTexts,
        ...(newSettings.customTexts || {})
      }
    };
    this.saveData(this.data);
    return this.data.settings;
  }
}

export const db = new StoreDatabase();
export { UPLOADS_DIR };
