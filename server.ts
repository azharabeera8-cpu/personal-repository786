import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_FEEDBACK, INITIAL_REVIEWS } from './src/data/initialProducts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DB_PATH = path.join(__dirname, 'data', 'database.json');

// Ensure database directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Database state
interface DatabaseSchema {
  products: typeof INITIAL_PRODUCTS;
  orders: typeof INITIAL_ORDERS;
  customers: typeof INITIAL_CUSTOMERS;
  feedback: typeof INITIAL_FEEDBACK;
  reviews: typeof INITIAL_REVIEWS;
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed.products && Array.isArray(parsed.products)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading database file, resetting to defaults:', err);
  }

  const initialDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    customers: INITIAL_CUSTOMERS,
    feedback: INITIAL_FEEDBACK,
    reviews: INITIAL_REVIEWS,
  };
  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

let db = loadDatabase();

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', brand: 'RANGMAHAL', time: new Date().toISOString() });
  });

  // PRODUCTS API
  app.get('/api/products', (_req, res) => {
    res.json(db.products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req, res) => {
    const newProduct = {
      ...req.body,
      id: req.body.id || `prod-${Date.now()}`,
      rating: req.body.rating || 5.0,
      reviewCount: req.body.reviewCount || 0,
      productCode: req.body.productCode || `RM-${Math.floor(100 + Math.random() * 900)}`,
    };
    db.products.unshift(newProduct);
    saveDatabase(db);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req, res) => {
    const index = db.products.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    db.products[index] = { ...db.products[index], ...req.body };
    saveDatabase(db);
    res.json(db.products[index]);
  });

  app.delete('/api/products/:id', (req, res) => {
    const initialLen = db.products.length;
    db.products = db.products.filter((p) => p.id !== req.params.id);
    if (db.products.length === initialLen) {
      return res.status(404).json({ error: 'Product not found' });
    }
    saveDatabase(db);
    res.json({ success: true, message: 'Product deleted successfully' });
  });

  // ORDERS API
  app.get('/api/orders', (_req, res) => {
    res.json(db.orders);
  });

  app.post('/api/orders', (req, res) => {
    const orderNumber = `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      ...req.body,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: req.body.status || 'Pending',
    };
    db.orders.unshift(newOrder);

    // Update customer stats
    const existingCust = db.customers.find((c) => c.email.toLowerCase() === newOrder.customerEmail.toLowerCase());
    if (existingCust) {
      existingCust.orderCount += 1;
      existingCust.totalSpent += newOrder.total;
    } else {
      db.customers.unshift({
        id: `cust-${Date.now()}`,
        name: newOrder.customerName,
        email: newOrder.customerEmail,
        phone: newOrder.customerPhone,
        city: newOrder.city,
        orderCount: 1,
        totalSpent: newOrder.total,
        registeredDate: new Date().toISOString().split('T')[0],
      });
    }

    saveDatabase(db);
    res.status(201).json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    order.status = req.body.status;
    saveDatabase(db);
    res.json(order);
  });

  // CUSTOMERS API
  app.get('/api/customers', (_req, res) => {
    res.json(db.customers);
  });

  // FEEDBACK API
  app.get('/api/feedback', (_req, res) => {
    res.json(db.feedback);
  });

  app.post('/api/feedback', (req, res) => {
    const newFeedback = {
      id: `fb-${Date.now()}`,
      name: req.body.name,
      email: req.body.email,
      rating: Number(req.body.rating) || 5,
      message: req.body.message,
      createdAt: new Date().toISOString(),
    };
    db.feedback.unshift(newFeedback);
    saveDatabase(db);
    res.status(201).json(newFeedback);
  });

  app.delete('/api/feedback/:id', (req, res) => {
    db.feedback = db.feedback.filter((f) => f.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true, message: 'Feedback removed' });
  });

  // REVIEWS API
  app.get('/api/reviews', (req, res) => {
    const { productId } = req.query;
    if (productId) {
      return res.json(db.reviews.filter((r) => r.productId === productId));
    }
    res.json(db.reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      productId: req.body.productId,
      customerName: req.body.customerName,
      city: req.body.city || 'Pakistan',
      rating: Number(req.body.rating) || 5,
      comment: req.body.comment,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };
    db.reviews.unshift(newReview);

    // Update product rating average
    const prodReviews = db.reviews.filter((r) => r.productId === req.body.productId);
    const avgRating = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = db.products.find((p) => p.id === req.body.productId);
    if (prod) {
      prod.rating = parseFloat(avgRating.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    saveDatabase(db);
    res.status(201).json(newReview);
  });

  // ADMIN ANALYTICS
  app.get('/api/admin/stats', (_req, res) => {
    const totalRevenue = db.orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
    const pendingOrders = db.orders.filter((o) => o.status === 'Pending').length;
    const completedOrders = db.orders.filter((o) => o.status === 'Delivered').length;

    res.json({
      totalProducts: db.products.length,
      totalOrders: db.orders.length,
      totalCustomers: db.customers.length,
      totalRevenue,
      pendingOrders,
      completedOrders,
      totalFeedback: db.feedback.length,
      recentOrders: db.orders.slice(0, 5),
    });
  });

  // AUTH API
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    res.json({
      token: 'jwt-token-customer-' + Date.now(),
      user: {
        id: 'usr-1',
        name: email.split('@')[0],
        email,
        role: 'customer',
      },
    });
  });

  app.post('/api/auth/admin-login', (req, res) => {
    const { email, password } = req.body;
    // Authorized admin credentials
    if ((email === 'admin@rangmahal.pk' || email === 'admin') && password === 'rangmahal2026') {
      res.json({
        token: 'jwt-token-admin-' + Date.now(),
        user: {
          id: 'admin-1',
          name: 'RANGMAHAL Admin',
          email: 'admin@rangmahal.pk',
          role: 'admin',
        },
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials. Use admin@rangmahal.pk / rangmahal2026' });
    }
  });

  // Mount Vite middlewares in development or serve static in production
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RANGMAHAL Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
