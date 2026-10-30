import type { Product, Category, Review, DiscountCode, Order, StoreSettings } from '../types/store.js';

class ApiClient {
  private getAuthHeader(): Record<string, string> {
    const token = localStorage.getItem('nutzo_admin_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Public Store Data
  async getStoreData(): Promise<{ products: Product[]; categories: Category[]; reviews: Review[]; settings: StoreSettings }> {
    const res = await fetch('/api/store/data');
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'فشل جلب بيانات المتجر');
    }
    return json.data;
  }

  // Submit Review
  async submitReview(authorName: string, rating: number, comment: string): Promise<Review> {
    const res = await fetch('/api/store/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ authorName, rating, comment })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'فشل إرسال التقييم');
    }
    return json.review;
  }

  // Validate Discount Coupon
  async validateCoupon(code: string, total: number): Promise<{ valid: boolean; discountAmount: number; message: string }> {
    const res = await fetch('/api/store/validate-coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, total })
    });
    return await res.json();
  }

  // Create Order
  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch('/api/store/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'فشل حفظ الطلب');
    }
    return json.order;
  }

  // Admin Login
  async adminLogin(pin: string): Promise<string> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin })
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'رمز الدخول غير صحيح');
    }
    localStorage.setItem('nutzo_admin_token', json.token);
    return json.token;
  }

  // Admin Verify
  async adminVerify(): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/verify', {
        headers: this.getAuthHeader()
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // Admin Logout
  async adminLogout(): Promise<void> {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: this.getAuthHeader()
      });
    } catch (e) {
      console.warn(e);
    }
    localStorage.removeItem('nutzo_admin_token');
  }

  // Admin All Data
  async getAdminAllData(): Promise<{ products: Product[]; categories: Category[]; reviews: Review[]; discountCodes: DiscountCode[]; orders: Order[]; settings: StoreSettings }> {
    const res = await fetch('/api/admin/all-data', {
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.message || 'فشل جلب بيانات الإدارة');
    }
    return json.data;
  }

  // Admin Product Actions
  async saveProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(product)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حفظ المنتج');
    return json.product;
  }

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حذف المنتج');
  }

  async toggleProductVisibility(id: string): Promise<void> {
    const res = await fetch(`/api/admin/products/${id}/toggle-visibility`, {
      method: 'POST',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل تغيير حالة المنتج');
  }

  // Category Actions
  async saveCategory(category: Partial<Category>): Promise<Category> {
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(category)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حفظ التصنيف');
    return json.category;
  }

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حذف التصنيف');
  }

  // Discount Codes
  async saveCoupon(coupon: Partial<DiscountCode>): Promise<DiscountCode> {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(coupon)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حفظ كود الخصم');
    return json.coupon;
  }

  async deleteCoupon(id: string): Promise<void> {
    const res = await fetch(`/api/admin/coupons/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حذف كود الخصم');
  }

  // Reviews Admin
  async deleteReview(id: string): Promise<void> {
    const res = await fetch(`/api/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حذف التقييم');
  }

  async toggleReviewVisibility(id: string): Promise<void> {
    const res = await fetch(`/api/admin/reviews/${id}/toggle-visibility`, {
      method: 'POST',
      headers: this.getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل تغيير حالة التقييم');
  }

  // Orders Admin
  async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const res = await fetch(`/api/admin/orders/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل تحديث حالة الطلب');
  }

  // Settings
  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل حفظ الإعدادات');
    return json.settings;
  }

  // Upload image
  async uploadImage(base64Data: string, filename: string): Promise<string> {
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify({ base64Data, filename })
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || 'فشل رفع الصورة');
    return json.url;
  }
}

export const api = new ApiClient();
