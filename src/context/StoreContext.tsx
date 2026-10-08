import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Product, CartItem, Order, CustomerFeedback } from '../types';
import { api } from '../services/api';

export type AppView = 'home' | 'shop' | 'collections' | 'about' | 'feedback' | 'contact' | 'checkout' | 'admin-dashboard';

interface StoreContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Navigation & Filtering
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedOccasion: string;
  setSelectedOccasion: (occ: string) => void;
  selectedFabric: string;
  setSelectedFabric: (fab: string) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  sortBy: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // PDP & Modals
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (p: Product | null) => void;
  openProductDetail: (product: Product) => void;

  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateCartQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  discountAmount: number;
  cartTotal: number;
  coupon: { code: string; discountPercent: number } | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Authentication
  isAdminLoggedIn: boolean;
  adminUser: { name: string; email: string } | null;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;

  // Customer Account
  currentUser: { name: string; email: string; phone?: string } | null;
  setCurrentUser: (u: { name: string; email: string; phone?: string } | null) => void;
  isCustomerAuthModalOpen: boolean;
  setIsCustomerAuthModalOpen: (open: boolean) => void;

  // Toast notifications
  toast: { text: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (text: string, type?: 'success' | 'error' | 'info') => void;

  // Orders
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (o: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('home');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [selectedFabric, setSelectedFabric] = useState('All');
  const [selectedColor, setSelectedColor] = useState('All');
  const [selectedSize, setSelectedSize] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Modals & PDP
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('rm_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<{ code: string; discountPercent: number } | null>(null);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rm_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('rm_admin_auth') === 'true';
  });
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(() => {
    return localStorage.getItem('rm_admin_auth') === 'true'
      ? { name: 'RANGMAHAL Admin', email: 'admin@rangmahal.pk' }
      : null;
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('rm_customer_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isCustomerAuthModalOpen, setIsCustomerAuthModalOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3800);
  };

  const loadAllProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('rm_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('rm_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart actions
  const addToCart = (product: Product, size?: string, quantity: number = 1) => {
    const chosenSize = size || product.sizes[0] || 'M';
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [...prev, { product, selectedSize: chosenSize, quantity }];
    });
    showToast(`Added ${product.name} (${chosenSize}) to your shopping bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.selectedSize === size ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const discountAmount = useMemo(() => {
    if (!coupon) return 0;
    return Math.round((cartSubtotal * coupon.discountPercent) / 100);
  }, [cartSubtotal, coupon]);

  // Free shipping above PKR 5,000, otherwise standard PKR 250
  const shippingFee = cartSubtotal === 0 ? 0 : cartSubtotal >= 5000 ? 0 : 250;

  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'RANG10') {
      setCoupon({ code: 'RANG10', discountPercent: 10 });
      showToast('Promo code applied: 10% discount on order!');
      return true;
    }
    if (clean === 'EID20') {
      setCoupon({ code: 'EID20', discountPercent: 20 });
      showToast('Eid Special: 20% discount applied!');
      return true;
    }
    showToast('Invalid promo code. Try "RANG10" or "EID20"', 'error');
    return false;
  };

  const removeCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to your wishlist!');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Admin auth
  const loginAdmin = (email: string, pass: string): boolean => {
    if ((email === 'admin@rangmahal.pk' || email === 'admin') && pass === 'rangmahal2026') {
      setIsAdminLoggedIn(true);
      setAdminUser({ name: 'RANGMAHAL Admin', email: 'admin@rangmahal.pk' });
      localStorage.setItem('rm_admin_auth', 'true');
      setIsAdminModalOpen(false);
      setCurrentView('admin-dashboard');
      showToast('Welcome to RANGMAHAL Admin Console');
      return true;
    }
    showToast('Invalid credentials. Use admin@rangmahal.pk / rangmahal2026', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('rm_admin_auth');
    setCurrentView('home');
    showToast('Logged out of Admin Console', 'info');
  };

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSelectedFabric('All');
    setSelectedColor('All');
    setSelectedSize('All');
    setSortBy('featured');
  };

  // Filtered products calculation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesFabric = p.fabric.toLowerCase().includes(q);
        const matchesOccasion = p.occasion.toLowerCase().includes(q);
        const matchesColor = p.color.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesFabric && !matchesOccasion && !matchesColor) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Occasion
      if (selectedOccasion !== 'All' && p.occasion !== selectedOccasion) {
        return false;
      }

      // Fabric
      if (selectedFabric !== 'All' && p.fabric !== selectedFabric) {
        return false;
      }

      // Color
      if (selectedColor !== 'All' && p.color !== selectedColor) {
        return false;
      }

      // Size
      if (selectedSize !== 'All' && !p.sizes.includes(selectedSize as any)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedOccasion, selectedFabric, selectedColor, selectedSize, sortBy]);

  return (
    <StoreContext.Provider
      value={{
        products,
        loading,
        refreshProducts: loadAllProducts,
        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedOccasion,
        setSelectedOccasion,
        selectedFabric,
        setSelectedFabric,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        sortBy,
        setSortBy,
        resetFilters,
        filteredProducts,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        openProductDetail,
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        discountAmount,
        cartTotal,
        coupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isAdminLoggedIn,
        adminUser,
        loginAdmin,
        logoutAdmin,
        isAdminModalOpen,
        setIsAdminModalOpen,
        currentUser,
        setCurrentUser,
        isCustomerAuthModalOpen,
        setIsCustomerAuthModalOpen,
        toast,
        showToast,
        lastPlacedOrder,
        setLastPlacedOrder,
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
