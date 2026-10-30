import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db, UPLOADS_DIR } from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static uploaded files permanently
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple in-memory session tokens for admin
const adminSessions = new Set<string>();

// Middleware to authenticate admin
const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({ success: false, message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول برمز الإدارة.' });
  }
  next();
};

// ================= PUBLIC API ROUTES =================

// 1. Get public store data
app.get('/api/store/data', (_req: Request, res: Response) => {
  try {
    const data = db.getPublicData();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// 2. Add public review
app.post('/api/store/reviews', (req: Request, res: Response) => {
  try {
    const { authorName, rating, comment } = req.body;
    if (!comment || !comment.trim()) {
      return res.status(400).json({ success: false, message: 'يرجى كتابة نص التقييم' });
    }
    const newReview = db.addReview(authorName || 'عميل نوتزو', Number(rating) || 5, comment);
    res.json({ success: true, review: newReview, message: 'تم نشر تقييمك بنجاح، شكراً لك!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// 3. Validate discount code
app.post('/api/store/validate-coupon', (req: Request, res: Response) => {
  try {
    const { code, total } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال كود الخصم' });
    }
    const result = db.validateCoupon(code, Number(total) || 0);
    res.json({ success: result.valid, ...result });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// 4. Create Order (Checkout to Discord / Bank Transfer)
app.post('/api/store/orders', (req: Request, res: Response) => {
  try {
    const { customerName, customerDiscord, customerNotes, items, subtotal, discountTotal, finalTotal, discountCode } = req.body;
    if (!customerName || !items || !items.length) {
      return res.status(400).json({ success: false, message: 'بيانات الطلب غير مكتملة' });
    }

    const order = db.createOrder({
      customerName: customerName.trim(),
      customerDiscord: (customerDiscord || '').trim(),
      customerNotes: (customerNotes || '').trim(),
      items,
      subtotal: Number(subtotal) || 0,
      discountTotal: Number(discountTotal) || 0,
      finalTotal: Number(finalTotal) || 0,
      discountCode,
      paymentMethod: 'bank_transfer'
    });

    res.json({ success: true, order, message: 'تم تسجيل طلبك بنجاح!' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// ================= ADMIN API ROUTES =================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { pin } = req.body;
    if (!pin || typeof pin !== 'string') {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الإدارة' });
    }

    if (db.verifyAdminPin(pin)) {
      const sessionToken = crypto.randomBytes(32).toString('hex');
      adminSessions.add(sessionToken);
      return res.json({ success: true, token: sessionToken, message: 'تم تسجيل دخول الإدارة بنجاح' });
    } else {
      return res.status(401).json({ success: false, message: 'رمز الإدارة غير صحيح!' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Verify Admin Session Token
app.get('/api/admin/verify', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, authenticated: true });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  if (token) {
    adminSessions.delete(token);
  }
  res.json({ success: true, message: 'تم تسجيل الخروج بنجاح' });
});

// Get all admin data
app.get('/api/admin/all-data', requireAdmin, (_req: Request, res: Response) => {
  try {
    const data = db.getAllData();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Save or Update Product
app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (!product.name || !product.originalPrice) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم المنتج وسعره' });
    }
    const saved = db.saveProduct({
      ...product,
      id: product.id || 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      originalPrice: Number(product.originalPrice),
      discountedPrice: product.discountedPrice ? Number(product.discountedPrice) : undefined,
      discountPercent: product.discountPercent ? Number(product.discountPercent) : undefined,
      isAvailable: product.isAvailable !== false,
      isHidden: !!product.isHidden,
      mainImage: product.mainImage || '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg',
      extraImages: Array.isArray(product.extraImages) ? product.extraImages : []
    });
    res.json({ success: true, product: saved, message: 'تم حفظ المنتج بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Delete Product
app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = db.deleteProduct(id);
    if (deleted) {
      res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    } else {
      res.status(404).json({ success: false, message: 'المنتج غير موجود' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Toggle Product Visibility
app.post('/api/admin/products/:id/toggle-visibility', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const toggled = db.toggleProductVisibility(id);
    res.json({ success: toggled, message: 'تم تحديث ظهور المنتج' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Save or Update Category
app.post('/api/admin/categories', requireAdmin, (req: Request, res: Response) => {
  try {
    const cat = req.body;
    if (!cat.name) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال اسم التصنيف' });
    }
    const saved = db.saveCategory({
      ...cat,
      id: cat.id || 'cat_' + Date.now(),
      order: Number(cat.order) || 0
    });
    res.json({ success: true, category: saved, message: 'تم حفظ التصنيف بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Delete Category
app.delete('/api/admin/categories/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = db.deleteCategory(id);
    res.json({ success: deleted, message: 'تم حذف التصنيف' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Save Discount Code
app.post('/api/admin/coupons', requireAdmin, (req: Request, res: Response) => {
  try {
    const coupon = req.body;
    if (!coupon.code || !coupon.value) {
      return res.status(400).json({ success: false, message: 'يرجى إدخال رمز الكود وقيمة الخصم' });
    }
    const saved = db.saveDiscountCode({
      ...coupon,
      id: coupon.id || 'coup_' + Date.now(),
      code: coupon.code.toUpperCase().trim(),
      value: Number(coupon.value),
      maxUses: Number(coupon.maxUses) || 0,
      currentUses: Number(coupon.currentUses) || 0,
      isActive: coupon.isActive !== false
    });
    res.json({ success: true, coupon: saved, message: 'تم حفظ كود الخصم بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Delete Discount Code
app.delete('/api/admin/coupons/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = db.deleteDiscountCode(id);
    res.json({ success: deleted, message: 'تم حذف كود الخصم' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Review actions (delete or toggle)
app.delete('/api/admin/reviews/:id', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = db.deleteReview(id);
    res.json({ success: deleted, message: 'تم حذف التقييم' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

app.post('/api/admin/reviews/:id/toggle-visibility', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const toggled = db.toggleReviewVisibility(id);
    res.json({ success: toggled, message: 'تم تحديث ظهور التقييم' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Update Order Status
app.post('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = db.updateOrderStatus(id, status);
    res.json({ success: updated, message: 'تم تحديث حالة الطلب' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Update Store Settings & Visual Customizations
app.post('/api/admin/settings', requireAdmin, (req: Request, res: Response) => {
  try {
    const newSettings = req.body;
    const updated = db.updateSettings(newSettings);
    res.json({ success: true, settings: updated, message: 'تم حفظ إعدادات المتجر بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Server error' });
  }
});

// Image Upload Endpoint (Base64 file upload directly to disk)
app.post('/api/admin/upload', requireAdmin, (req: Request, res: Response) => {
  try {
    const { base64Data, filename } = req.body;
    if (!base64Data) {
      return res.status(400).json({ success: false, message: 'بيانات الصورة مفقودة' });
    }

    // Extract base64
    const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    let extension = 'png';
    let buffer: Buffer;

    if (matches && matches.length === 3) {
      extension = matches[1].replace('jpeg', 'jpg');
      buffer = Buffer.from(matches[2], 'base64');
    } else {
      buffer = Buffer.from(base64Data, 'base64');
    }

    const cleanName = (filename || 'upload').replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileName = `${cleanName}_${Date.now()}.${extension}`;
    const filePath = path.join(UPLOADS_DIR, safeFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${safeFileName}`;
    res.json({ success: true, url: publicUrl, message: 'تم رفع الصورة وحفظها بنجاح' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'فشل رفع الصورة' });
  }
});

// ================= STATIC SERVING & VITE INTEGRATION =================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
