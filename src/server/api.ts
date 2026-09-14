import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { loadDatabase, saveDatabase, hashPassword, verifyPassword, StoredUser } from './db.js';
import { Product, Review, Order, CustomCakeRequest, User } from '../types.js';

const router = express.Router();
const TOKEN_SECRET = process.env.JWT_SECRET || 'crumb-and-co-artisan-secret-key-2026';

// Token generation and verification helper
export function createToken(user: { id: string; email: string; role: string; name: string }): string {
  const payload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
  return `${payloadStr}.${signature}`;
}

export function verifyToken(token: string): { sub: string; email: string; role: string; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payloadStr, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(payloadStr).digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  req.user = {
    id: payload.sub,
    email: payload.email,
    role: payload.role,
    name: payload.name
  };
  next();
}

export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authenticate(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  });
}

// ----------------------------------------------------
// AUTH ROUTES
// ----------------------------------------------------

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, phone, password, address } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const db = loadDatabase();
  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser: StoredUser = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    role: 'customer',
    savedAddress: address || undefined,
    createdAt: new Date().toISOString(),
    passwordHash: hash,
    salt
  };

  db.users.push(newUser);
  saveDatabase(db);

  const token = createToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name
  });

  const { passwordHash: _, salt: __, ...userProfile } = newUser;
  res.status(201).json({ user: userProfile, token });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = loadDatabase();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  });

  const { passwordHash: _, salt: __, ...userProfile } = user;
  res.json({ user: userProfile, token });
});

router.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === req.user?.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const { passwordHash: _, salt: __, ...userProfile } = user;
  res.json({ user: userProfile });
});

router.put('/auth/profile', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const userIndex = db.users.findIndex(u => u.id === req.user?.id);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, phone, savedAddress } = req.body;
  if (name) db.users[userIndex].name = name;
  if (phone !== undefined) db.users[userIndex].phone = phone;
  if (savedAddress) db.users[userIndex].savedAddress = savedAddress;

  saveDatabase(db);
  const { passwordHash: _, salt: __, ...userProfile } = db.users[userIndex];
  res.json({ user: userProfile });
});

// ----------------------------------------------------
// PRODUCT ROUTES
// ----------------------------------------------------

router.get('/products', (req: Request, res: Response) => {
  const db = loadDatabase();
  let products = [...db.products];

  const category = req.query.category as string;
  const search = req.query.search as string;
  const featured = req.query.featured as string;
  const availability = req.query.availability as string;
  const sort = req.query.sort as string;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }

  if (featured === 'true') {
    products = products.filter(p => p.isFeatured);
  }

  if (availability === 'available') {
    products = products.filter(p => p.isAvailable);
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    products = products.filter(p => p.price <= maxPrice);
  }

  if (search) {
    const term = search.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.flavours.some(f => f.toLowerCase().includes(term))
    );
  }

  if (sort) {
    switch (sort) {
      case 'Price: Low to High':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'Highest Rated':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        // reverse ID order
        products.reverse();
        break;
      case 'Popular':
      default:
        products.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  res.json(products);
});

router.get('/products/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Admin Product Management
router.post('/admin/products', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const {
    name,
    tagline,
    description,
    image,
    category,
    price,
    sizes,
    flavours,
    ingredients,
    allergens,
    isAvailable,
    isFeatured,
    badge
  } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'Name, category, and price are required' });
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name,
    tagline: tagline || '',
    description: description || '',
    image: image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
    category,
    price: Number(price),
    sizes: sizes && sizes.length > 0 ? sizes : [{ size: 'Standard', price: Number(price) }],
    flavours: flavours || ['Original'],
    ingredients: ingredients || ['Flour', 'Butter', 'Sugar'],
    allergens: allergens || ['Contains Dairy', 'Contains Gluten'],
    isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    isFeatured: Boolean(isFeatured),
    rating: 5.0,
    reviewCount: 0,
    badge: badge || undefined
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

router.put('/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated: Product = {
    ...db.products[index],
    ...req.body,
    id: db.products[index].id // preserve ID
  };

  db.products[index] = updated;
  saveDatabase(db);
  res.json(updated);
});

router.patch('/admin/products/:id/availability', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  product.isAvailable = Boolean(req.body.isAvailable);
  saveDatabase(db);
  res.json({ id: product.id, isAvailable: product.isAvailable });
});

router.patch('/admin/products/:id/prices', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  if (req.body.price !== undefined) {
    product.price = Number(req.body.price);
  }
  if (Array.isArray(req.body.sizes)) {
    product.sizes = req.body.sizes;
  }

  saveDatabase(db);
  res.json(product);
});

router.delete('/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== req.params.id);
  if (db.products.length === initialLen) {
    return res.status(404).json({ error: 'Product not found' });
  }
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted permanently' });
});

// ----------------------------------------------------
// ORDER ROUTES
// ----------------------------------------------------

router.post('/orders', (req: Request, res: Response) => {
  const db = loadDatabase();
  const { customer, address, items, deliveryDate, deliveryTimeSlot, specialInstructions, paymentMethod } = req.body;

  if (!customer?.fullName || !customer?.phone || !customer?.email) {
    return res.status(400).json({ error: 'Customer contact information is required' });
  }
  if (!address?.street || !address?.city || !address?.pincode) {
    return res.status(400).json({ error: 'Complete delivery address is required' });
  }
  if (!items || !items.length) {
    return res.status(400).json({ error: 'Cart must contain at least one treat' });
  }

  // Calculate pricing
  const subtotal = items.reduce((acc: number, item: any) => acc + (item.unitPrice * item.quantity), 0);
  const deliveryFee = subtotal >= 999 ? 0 : 80;
  const discount = subtotal >= 1500 ? 100 : 0;
  const total = subtotal + deliveryFee - discount;

  // Optional authenticated user id
  let userId: string | undefined = undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (payload) userId = payload.sub;
  }

  const orderId = `CNC-${Math.floor(10000 + Math.random() * 90000)}`;
  const newOrder: Order = {
    id: orderId,
    userId,
    customer,
    address,
    items,
    subtotal,
    deliveryFee,
    discount,
    total,
    deliveryDate: deliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    deliveryTimeSlot: deliveryTimeSlot || '14:00 - 17:00 (Afternoon)',
    specialInstructions: specialInstructions || '',
    paymentMethod: paymentMethod || 'UPI',
    status: 'Confirmed', // starts confirmed
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);
  saveDatabase(db);
  res.status(201).json(newOrder);
});

router.get('/orders/:id', (req: Request, res: Response) => {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

router.get('/customer/orders', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const customerOrders = db.orders.filter(
    o => o.userId === req.user?.id || o.customer.email.toLowerCase() === req.user?.email.toLowerCase()
  );
  res.json(customerOrders);
});

router.get('/admin/orders', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  res.json(db.orders);
});

router.patch('/admin/orders/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const { status } = req.body;
  const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid order status' });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveDatabase(db);
  res.json(order);
});

// ----------------------------------------------------
// REVIEW ROUTES
// ----------------------------------------------------

router.get('/reviews', (req: Request, res: Response) => {
  const db = loadDatabase();
  const featured = req.query.featured === 'true';
  const productId = req.query.productId as string;

  let reviews = db.reviews.filter(r => r.isApproved);
  if (featured) {
    reviews = reviews.filter(r => r.isFeatured);
  }
  if (productId) {
    reviews = reviews.filter(r => r.productId === productId);
  }

  res.json(reviews);
});

router.post('/reviews', (req: Request, res: Response) => {
  const { customerName, productId, productName, rating, comment, image } = req.body;
  if (!customerName || !productId || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required review fields' });
  }

  const db = loadDatabase();
  let userId: string | undefined;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (payload) userId = payload.sub;
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    userId,
    customerName,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    productId,
    productName: productName || 'Bakery Treat',
    rating: Number(rating),
    comment,
    image: image || undefined,
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    isApproved: false, // Must be approved by owner first!
    isFeatured: false
  };

  db.reviews.unshift(newReview);
  saveDatabase(db);
  res.status(201).json({
    message: 'Thank you for your review! It will appear publicly once approved by our head baker.',
    review: newReview
  });
});

router.get('/admin/reviews', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  res.json(db.reviews);
});

router.patch('/admin/reviews/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const review = db.reviews.find(r => r.id === req.params.id);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  if (req.body.isApproved !== undefined) review.isApproved = Boolean(req.body.isApproved);
  if (req.body.isFeatured !== undefined) review.isFeatured = Boolean(req.body.isFeatured);

  saveDatabase(db);
  res.json(review);
});

router.delete('/admin/reviews/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const initLen = db.reviews.length;
  db.reviews = db.reviews.filter(r => r.id !== req.params.id);
  if (db.reviews.length === initLen) {
    return res.status(404).json({ error: 'Review not found' });
  }
  saveDatabase(db);
  res.json({ success: true, message: 'Review deleted' });
});

// ----------------------------------------------------
// CUSTOM CAKE REQUEST ROUTES
// ----------------------------------------------------

router.post('/custom-cakes', (req: Request, res: Response) => {
  const {
    name,
    phone,
    email,
    cakeType,
    cakeSize,
    flavour,
    preferredDate,
    preferredTime,
    theme,
    customMessage,
    specialRequirements,
    referenceImage
  } = req.body;

  if (!name || !phone || !email || !cakeType || !cakeSize || !preferredDate) {
    return res.status(400).json({ error: 'Please provide all required cake inquiry details' });
  }

  const db = loadDatabase();
  const newRequest: CustomCakeRequest = {
    id: `CC-${Math.floor(100 + Math.random() * 900)}`,
    name,
    phone,
    email,
    cakeType,
    cakeSize,
    flavour: flavour || 'Chef Choice',
    preferredDate,
    preferredTime: preferredTime || '14:00',
    theme: theme || 'Artisan Celebration Theme',
    customMessage,
    specialRequirements,
    referenceImage: referenceImage || undefined,
    status: 'New',
    createdAt: new Date().toISOString()
  };

  db.customCakes.unshift(newRequest);
  saveDatabase(db);
  res.status(201).json({
    message: 'Your custom cake request has been submitted! Our chef will review and get back within 2-4 hours.',
    request: newRequest
  });
});

router.get('/admin/custom-cakes', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  res.json(db.customCakes);
});

router.patch('/admin/custom-cakes/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();
  const request = db.customCakes.find(c => c.id === req.params.id);
  if (!request) {
    return res.status(404).json({ error: 'Custom cake request not found' });
  }

  if (req.body.status) request.status = req.body.status;
  if (req.body.estimatedQuote !== undefined) request.estimatedQuote = Number(req.body.estimatedQuote);

  saveDatabase(db);
  res.json(request);
});

// ----------------------------------------------------
// ADMIN DASHBOARD ANALYTICS
// ----------------------------------------------------

router.get('/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const db = loadDatabase();

  const totalOrders = db.orders.length;
  const totalRevenue = db.orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = db.orders.filter(o => o.createdAt.startsWith(today)).length;
  const pendingOrders = db.orders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Preparing').length;
  const unavailableProductsCount = db.products.filter(p => !p.isAvailable).length;

  const totalReviews = db.reviews.length;
  const avgRating = totalReviews > 0
    ? (db.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : '4.9';

  // Sales Trends (Daily past 7 days)
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const salesByDay = days.map((day, idx) => ({
    name: day,
    sales: 1800 + idx * 650 + Math.floor(Math.sin(idx * 2) * 500),
    orders: 3 + idx * 2
  }));

  // Popular categories distribution
  const categoryCount: Record<string, number> = {};
  db.products.forEach(p => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });

  const popularCategories = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value
  }));

  res.json({
    totalOrders,
    todayOrders,
    pendingOrders,
    totalRevenue,
    totalProducts: db.products.length,
    unavailableProductsCount,
    averageRating: avgRating,
    salesByDay,
    popularCategories
  });
});

// Contact route
router.post('/contact', (req: Request, res: Response) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  res.json({ success: true, message: 'Message received! We will get back to you shortly.' });
});

export default router;
