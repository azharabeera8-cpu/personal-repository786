import { Product, Order, Customer, CustomerFeedback, ProductReview } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_FEEDBACK, INITIAL_REVIEWS } from '../data/initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'rangmahal_products_v1',
  ORDERS: 'rangmahal_orders_v1',
  CUSTOMERS: 'rangmahal_customers_v1',
  FEEDBACK: 'rangmahal_feedback_v1',
  REVIEWS: 'rangmahal_reviews_v1',
  CART: 'rangmahal_cart_v1',
  WISHLIST: 'rangmahal_wishlist_v1',
  AUTH: 'rangmahal_auth_v1',
};

// Local storage helpers for instant optimistic responsiveness & offline resilience
function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage write failed:', e);
  }
}

export const api = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.PRODUCTS, data);
        return data;
      }
    } catch {
      // fallback to local cache
    }
    return getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async addProduct(product: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const newId = product.id || `prod-${Date.now()}`;
    const fullProduct: Product = {
      ...product,
      id: newId,
      productCode: product.productCode || `RM-${Math.floor(100 + Math.random() * 900)}`,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      galleryImages: product.galleryImages?.length ? product.galleryImages : [product.image],
    };

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullProduct),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
        setLocal(STORAGE_KEYS.PRODUCTS, [saved, ...current.filter((p) => p.id !== saved.id)]);
        return saved;
      }
    } catch {
      // optimistic fallback
    }

    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const updated = [fullProduct, ...current];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    return fullProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
        const next = current.map((p) => (p.id === id ? saved : p));
        setLocal(STORAGE_KEYS.PRODUCTS, next);
        return saved;
      }
    } catch {
      // optimistic fallback
    }

    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const target = current.find((p) => p.id === id);
    const updated = { ...target, ...updates } as Product;
    const next = current.map((p) => (p.id === id ? updated : p));
    setLocal(STORAGE_KEYS.PRODUCTS, next);
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {
      // optimistic continue
    }
    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setLocal(
      STORAGE_KEYS.PRODUCTS,
      current.filter((p) => p.id !== id)
    );
    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.ORDERS, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
    const orderNumber = `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (res.ok) {
        const saved = await res.json();
        const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
        setLocal(STORAGE_KEYS.ORDERS, [saved, ...currentOrders]);
        return saved;
      }
    } catch {
      // optimistic fallback
    }

    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setLocal(STORAGE_KEYS.ORDERS, [newOrder, ...currentOrders]);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
        setLocal(
          STORAGE_KEYS.ORDERS,
          current.map((o) => (o.id === orderId ? saved : o))
        );
        return saved;
      }
    } catch {
      // fallback
    }

    const current = getLocal<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const target = current.find((o) => o.id === orderId);
    if (!target) return null;
    target.status = status;
    setLocal(
      STORAGE_KEYS.ORDERS,
      current.map((o) => (o.id === orderId ? target : o))
    );
    return target;
  },

  // CUSTOMERS
  async getCustomers(): Promise<Customer[]> {
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.CUSTOMERS, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocal<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  // FEEDBACK
  async getFeedback(): Promise<CustomerFeedback[]> {
    try {
      const res = await fetch('/api/feedback');
      if (res.ok) {
        const data = await res.json();
        setLocal(STORAGE_KEYS.FEEDBACK, data);
        return data;
      }
    } catch {
      // fallback
    }
    return getLocal<CustomerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  },

  async submitFeedback(data: { name: string; email: string; rating: number; message: string }): Promise<CustomerFeedback> {
    const newFeedback: CustomerFeedback = {
      id: `fb-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<CustomerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
        setLocal(STORAGE_KEYS.FEEDBACK, [saved, ...current]);
        return saved;
      }
    } catch {
      // optimistic fallback
    }

    const current = getLocal<CustomerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    setLocal(STORAGE_KEYS.FEEDBACK, [newFeedback, ...current]);
    return newFeedback;
  },

  async deleteFeedback(id: string): Promise<boolean> {
    try {
      await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
    } catch {
      // fallback
    }
    const current = getLocal<CustomerFeedback[]>(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
    setLocal(
      STORAGE_KEYS.FEEDBACK,
      current.filter((f) => f.id !== id)
    );
    return true;
  },

  // REVIEWS
  async getReviews(productId?: string): Promise<ProductReview[]> {
    try {
      const url = productId ? `/api/reviews?productId=${productId}` : '/api/reviews';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch {
      // fallback
    }
    const all = getLocal<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    return productId ? all.filter((r) => r.productId === productId) : all;
  },

  async addReview(review: Omit<ProductReview, 'id' | 'createdAt' | 'verifiedPurchase'>): Promise<ProductReview> {
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      verifiedPurchase: true,
    };

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (res.ok) {
        const saved = await res.json();
        const current = getLocal<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
        setLocal(STORAGE_KEYS.REVIEWS, [saved, ...current]);
        return saved;
      }
    } catch {
      // fallback
    }

    const current = getLocal<ProductReview[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setLocal(STORAGE_KEYS.REVIEWS, [newReview, ...current]);
    return newReview;
  },
};
