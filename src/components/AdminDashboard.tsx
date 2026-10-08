import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Customer, CustomerFeedback } from '../types';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  X,
  Eye,
  Store,
  Sparkles
} from 'lucide-react';

type AdminTab = 'overview' | 'products' | 'orders' | 'customers' | 'feedback';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    refreshProducts,
    logoutAdmin,
    setCurrentView,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [feedbackList, setFeedbackList] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states for Product Add/Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete product confirmation
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Form states for Product Add/Edit
  const [prodForm, setProdForm] = useState({
    name: '',
    subtitle: '',
    price: 6999,
    originalPrice: 8499,
    discountPercent: 18,
    image: '/src/assets/images/product_lawn_gulab_suit_1791444014404.jpg',
    category: 'Lawn' as Product['category'],
    dressType: '3 Piece Suit' as Product['dressType'],
    fabric: 'Lawn' as Product['fabric'],
    work: 'Embroidery' as Product['work'],
    occasion: 'Eid' as Product['occasion'],
    color: 'Blush Pink',
    colorHex: '#F4C2C2',
    sizes: ['S', 'M', 'L'] as Product['sizes'],
    description: '',
    stock: 20,
    isFeatured: true,
    isNewArrival: true,
  });

  const availableSampleImages = [
    { label: 'Rose Pink Lawn Suit', path: '/src/assets/images/product_lawn_gulab_suit_1791444014404.jpg' },
    { label: 'Emerald Festive Chiffon', path: '/src/assets/images/product_festive_emerald_1791444031532.jpg' },
    { label: 'Royal Blue Formal Ensemble', path: '/src/assets/images/product_royal_blue_suit_1791444049528.jpg' },
    { label: 'Mughal Maroon Royal Dress', path: '/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg' },
    { label: 'Zardozi Hand Embroidery', path: '/src/assets/images/category_embroidery_craft_1791444062545.jpg' },
  ];

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [o, c, f] = await Promise.all([
        api.getOrders(),
        api.getCustomers(),
        api.getFeedback(),
      ]);
      setOrders(o);
      setCustomers(c);
      setFeedbackList(f);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  // Calculations for stats
  const totalRevenue = orders.reduce(
    (sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum),
    0
  );
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const completedOrders = orders.filter((o) => o.status === 'Delivered').length;

  // Open Add Product Modal
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      subtitle: '',
      price: 6999,
      originalPrice: 8499,
      discountPercent: 18,
      image: availableSampleImages[0].path,
      category: 'Lawn',
      dressType: '3 Piece Suit',
      fabric: 'Lawn',
      work: 'Embroidery',
      occasion: 'Eid',
      color: 'Blush Pink',
      colorHex: '#F4C2C2',
      sizes: ['S', 'M', 'L'],
      description: '',
      stock: 20,
      isFeatured: true,
      isNewArrival: true,
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      subtitle: p.subtitle || '',
      price: p.price,
      originalPrice: p.originalPrice || Math.round(p.price * 1.2),
      discountPercent: p.discountPercent || 0,
      image: p.image,
      category: p.category,
      dressType: p.dressType,
      fabric: p.fabric,
      work: p.work,
      occasion: p.occasion,
      color: p.color,
      colorHex: p.colorHex,
      sizes: p.sizes,
      description: p.description,
      stock: p.stock,
      isFeatured: !!p.isFeatured,
      isNewArrival: !!p.isNewArrival,
    });
    setIsProductModalOpen(true);
  };

  // Save Add/Edit
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name.trim() || !prodForm.description.trim()) {
      showToast('Please provide garment name and description', 'error');
      return;
    }

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: prodForm.name.trim(),
          subtitle: prodForm.subtitle.trim() || undefined,
          price: Number(prodForm.price),
          originalPrice: Number(prodForm.originalPrice),
          discountPercent: Number(prodForm.discountPercent),
          image: prodForm.image,
          category: prodForm.category,
          dressType: prodForm.dressType,
          fabric: prodForm.fabric,
          work: prodForm.work,
          occasion: prodForm.occasion,
          color: prodForm.color,
          colorHex: prodForm.colorHex,
          sizes: prodForm.sizes,
          description: prodForm.description.trim(),
          stock: Number(prodForm.stock),
          isFeatured: prodForm.isFeatured,
          isNewArrival: prodForm.isNewArrival,
        });
        showToast(`Updated "${prodForm.name}" successfully!`);
      } else {
        await api.addProduct({
          name: prodForm.name.trim(),
          subtitle: prodForm.subtitle.trim() || undefined,
          price: Number(prodForm.price),
          originalPrice: Number(prodForm.originalPrice),
          discountPercent: Number(prodForm.discountPercent),
          image: prodForm.image,
          galleryImages: [prodForm.image],
          category: prodForm.category,
          dressType: prodForm.dressType,
          fabric: prodForm.fabric,
          work: prodForm.work,
          occasion: prodForm.occasion,
          color: prodForm.color,
          colorHex: prodForm.colorHex,
          sizes: prodForm.sizes,
          description: prodForm.description.trim(),
          stock: Number(prodForm.stock),
          isFeatured: prodForm.isFeatured,
          isNewArrival: prodForm.isNewArrival,
          rating: 5.0,
          reviewCount: 0,
          productCode: `RM-${Math.floor(100 + Math.random() * 900)}`,
        });
        showToast(`Added new dress "${prodForm.name}" to RANGMAHAL!`);
      }

      await refreshProducts();
      setIsProductModalOpen(false);
    } catch {
      showToast('Failed to save product', 'error');
    }
  };

  // Confirm delete product
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.deleteProduct(productToDelete.id);
      await refreshProducts();
      showToast(`Deleted "${productToDelete.name}" from catalog.`);
      setProductToDelete(null);
    } catch {
      showToast('Could not delete product', 'error');
    }
  };

  // Update order status
  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus);
      if (updated) {
        setOrders(orders.map((o) => (o.id === orderId ? updated : o)));
        showToast(`Order status updated to ${newStatus}`);
      }
    } catch {
      showToast('Could not update order status', 'error');
    }
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    try {
      await api.deleteFeedback(id);
      setFeedbackList(feedbackList.filter((f) => f.id !== id));
      showToast('Feedback removed');
    } catch {
      showToast('Could not remove feedback', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EB] flex flex-col">
      
      {/* Admin Top Header */}
      <header className="bg-[#4E0E1B] text-[#FAF8F5] border-b border-[#671B26] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <span className="font-brand text-xl font-bold tracking-[0.2em] text-[#FAF8F5]">
            RANGMAHAL
          </span>
          <span className="text-[11px] font-mono tracking-wider bg-[#800020] text-[#F7E7CE] px-2 py-0.5 rounded uppercase">
            Admin Console
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#671B26] hover:bg-[#800020] text-[#FAF8F5] rounded transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>View Public Storefront</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-200 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        
        {/* Navigation Tabs (Single-line segmented control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 border-b border-[#E0D6C8]">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
            { id: 'feedback', label: `Feedback (${feedbackList.length})`, icon: MessageSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#800020] text-white shadow-sm'
                    : 'bg-white border border-[#E8DFD4] text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- TAB 1: OVERVIEW --- */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span className="font-semibold uppercase tracking-wider">Total Revenue</span>
                  <DollarSign className="w-4 h-4 text-[#800020]" />
                </div>
                <div className="font-mono tabular-nums text-2xl font-bold text-stone-900">
                  PKR {totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Real-time confirmed Pakistani orders</span>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span className="font-semibold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-4 h-4 text-[#800020]" />
                </div>
                <div className="font-mono tabular-nums text-2xl font-bold text-stone-900">
                  {orders.length}
                </div>
                <div className="text-[11px] text-stone-500">
                  {pendingOrders} Pending · {completedOrders} Delivered
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span className="font-semibold uppercase tracking-wider">Active Products</span>
                  <Package className="w-4 h-4 text-[#800020]" />
                </div>
                <div className="font-mono tabular-nums text-2xl font-bold text-stone-900">
                  {products.length}
                </div>
                <div className="text-[11px] text-stone-500">
                  Across 8 Eastern categories
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs">
                  <span className="font-semibold uppercase tracking-wider">Customer Feedback</span>
                  <MessageSquare className="w-4 h-4 text-[#800020]" />
                </div>
                <div className="font-mono tabular-nums text-2xl font-bold text-stone-900">
                  {feedbackList.length}
                </div>
                <div className="text-[11px] text-emerald-700 font-medium">
                  Average 4.9 ★ satisfaction
                </div>
              </div>

            </div>

            {/* Analytics & Performance Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Sales & Orders Breakdown (7 cols) */}
              <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#E8DFD4] shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3">
                  <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                    Order Status Breakdown
                  </h3>
                  <span className="text-xs text-stone-500">Current active pipeline</span>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Pending Verification', count: orders.filter(o => o.status === 'Pending').length, color: 'bg-amber-500' },
                    { label: 'Confirmed & Packaging', count: orders.filter(o => o.status === 'Confirmed').length, color: 'bg-blue-500' },
                    { label: 'Processing at Atelier', count: orders.filter(o => o.status === 'Processing').length, color: 'bg-purple-500' },
                    { label: 'Shipped via Courier (TCS/Leopard)', count: orders.filter(o => o.status === 'Shipped').length, color: 'bg-indigo-500' },
                    { label: 'Successfully Delivered', count: orders.filter(o => o.status === 'Delivered').length, color: 'bg-emerald-600' },
                  ].map((st) => (
                    <div key={st.label} className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-700 font-medium">{st.label}</span>
                        <span className="font-mono font-bold text-stone-900">{st.count} orders</span>
                      </div>
                      <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`${st.color} h-full rounded-full transition-all`}
                          style={{
                            width: `${orders.length ? Math.max(5, (st.count / orders.length) * 100) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Products Spotlight (5 cols) */}
              <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E8DFD4] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3">
                  <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                    Bestselling Creations
                  </h3>
                  <span className="text-xs text-stone-500">High demand</span>
                </div>

                <div className="space-y-3">
                  {products.slice(0, 4).map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                      <img src={p.image} alt={p.name} className="w-12 h-14 rounded object-cover bg-stone-100" />
                      <div className="flex-1 text-xs">
                        <h4 className="font-semibold text-stone-900 line-clamp-1">{p.name}</h4>
                        <p className="text-stone-500">{p.fabric} · {p.dressType}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono tabular-nums text-xs font-bold text-[#800020] block">
                          PKR {p.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">{p.stock} in stock</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* --- TAB 2: PRODUCT MANAGEMENT (CRUD) --- */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs">
              <div>
                <h3 className="font-serif-luxury text-xl font-medium text-stone-900">
                  Garment Catalog Management
                </h3>
                <p className="text-xs text-stone-500">
                  Add new Pakistani dresses, modify pricing, manage stock, and delete discontinued designs.
                </p>
              </div>

              <button
                onClick={handleOpenAdd}
                className="px-5 py-2.5 bg-[#800020] hover:bg-[#671B26] text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Dress</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-[#E8DFD4] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E8DFD4] text-stone-600 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Garment</th>
                      <th className="py-3.5 px-4 font-semibold">Category</th>
                      <th className="py-3.5 px-4 font-semibold">Fabric & Work</th>
                      <th className="py-3.5 px-4 font-semibold">Price (PKR)</th>
                      <th className="py-3.5 px-4 font-semibold">Stock</th>
                      <th className="py-3.5 px-4 font-semibold">Rating</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DF]">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-12 rounded object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-stone-900 block">{p.name}</span>
                            <span className="text-[11px] text-stone-400 font-mono">{p.productCode}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-700 font-medium">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {p.fabric} · {p.work}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-semibold text-stone-900">
                          PKR {p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            p.stock > 10 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {p.rating.toFixed(1)} ★ ({p.reviewCount})
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 text-stone-600 hover:text-[#800020] hover:bg-stone-100 rounded transition-colors"
                              title="Edit product"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setProductToDelete(p)}
                              className="p-1.5 text-stone-600 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 3: ORDER MANAGEMENT --- */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs">
              <h3 className="font-serif-luxury text-xl font-medium text-stone-900">
                Customer Orders Pipeline
              </h3>
              <p className="text-xs text-stone-500">
                Update fulfillment status as orders progress through packing, courier dispatch, and COD delivery.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E8DFD4] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E8DFD4] text-stone-600 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Order ID</th>
                      <th className="py-3.5 px-4 font-semibold">Customer Details</th>
                      <th className="py-3.5 px-4 font-semibold">Items</th>
                      <th className="py-3.5 px-4 font-semibold">Total Amount</th>
                      <th className="py-3.5 px-4 font-semibold">Payment</th>
                      <th className="py-3.5 px-4 font-semibold">Current Status</th>
                      <th className="py-3.5 px-4 font-semibold">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DF]">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          {o.orderNumber}
                          <span className="block text-[10px] text-stone-400 font-normal">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-stone-900 block">{o.customerName}</span>
                          <span className="text-[11px] text-stone-500 font-mono block">{o.customerPhone}</span>
                          <span className="text-[11px] text-stone-400">{o.city}, {o.province}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-stone-800 font-medium block">
                            {o.items.length} {o.items.length === 1 ? 'outfit' : 'outfits'}
                          </span>
                          <span className="text-[11px] text-stone-500 line-clamp-1">
                            {o.items.map((i) => `${i.name} (${i.size})`).join(', ')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums font-bold text-[#800020]">
                          PKR {o.total.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-stone-700">
                          {o.paymentMethod}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            o.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.status === 'Shipped'
                              ? 'bg-indigo-100 text-indigo-800'
                              : o.status === 'Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : o.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => handleStatusChange(o.id, e.target.value as any)}
                            className="px-2.5 py-1 text-xs bg-white border border-stone-300 rounded font-medium text-stone-800 focus:outline-none focus:border-[#800020]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 4: CUSTOMER MANAGEMENT --- */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs">
              <h3 className="font-serif-luxury text-xl font-medium text-stone-900">
                Registered Pakistani Customers
              </h3>
              <p className="text-xs text-stone-500">
                View customer directory, contact numbers, order frequency, and lifetime spend in PKR.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E8DFD4] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E8DFD4] text-stone-600 uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-4 font-semibold">Customer Name</th>
                      <th className="py-3.5 px-4 font-semibold">Email</th>
                      <th className="py-3.5 px-4 font-semibold">Phone</th>
                      <th className="py-3.5 px-4 font-semibold">City</th>
                      <th className="py-3.5 px-4 font-semibold">Orders Count</th>
                      <th className="py-3.5 px-4 font-semibold">Total Spent (PKR)</th>
                      <th className="py-3.5 px-4 font-semibold">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E9DF]">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {c.name}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {c.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-700">
                          {c.phone}
                        </td>
                        <td className="py-3 px-4 text-stone-700 font-medium">
                          {c.city}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-900">
                          {c.orderCount}
                        </td>
                        <td className="py-3 px-4 font-mono tabular-nums font-bold text-[#800020]">
                          PKR {c.totalSpent.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono text-stone-400">
                          {c.registeredDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* --- TAB 5: FEEDBACK MANAGEMENT --- */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs">
              <h3 className="font-serif-luxury text-xl font-medium text-stone-900">
                Customer Feedback Moderation
              </h3>
              <p className="text-xs text-stone-500">
                Read reflections and reviews submitted by Pakistani shoppers; delete any spam or inappropriate entries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackList.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-white p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-stone-900 text-xs sm:text-sm">{fb.name}</h4>
                      <p className="text-[11px] text-stone-400">{fb.email}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-[#D4AF37]">
                        {fb.rating} ★
                      </span>
                      <button
                        onClick={() => handleDeleteFeedback(fb.id)}
                        className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                        title="Delete feedback"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-stone-700 font-light leading-relaxed bg-[#FAF8F5] p-3 rounded border border-[#F0E9DF]">
                    "{fb.message}"
                  </p>

                  <div className="text-[10px] font-mono text-stone-400">
                    Submitted: {new Date(fb.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8DFD4] overflow-hidden my-6">
            
            <div className="px-6 py-4 bg-[#4E0E1B] text-[#FAF8F5] flex items-center justify-between">
              <h3 className="font-serif-luxury text-lg font-medium">
                {editingProduct ? 'Edit Eastern Dress Information' : 'Add New Eastern Dress'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Garment Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="e.g. Pariwash Chiffon Luxury"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Subtitle / Kicker
                  </label>
                  <input
                    type="text"
                    value={prodForm.subtitle}
                    onChange={(e) => setProdForm({ ...prodForm, subtitle: e.target.value })}
                    placeholder="e.g. 3-Piece Tilla Embroidered Spring Festive"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Price in PKR *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    placeholder="6999"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Original Price (PKR)
                  </label>
                  <input
                    type="number"
                    value={prodForm.originalPrice}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    placeholder="8499"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    placeholder="25"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              {/* Eastern Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={prodForm.category}
                    onChange={(e) => setProdForm({ ...prodForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  >
                    <option value="Lawn">Lawn</option>
                    <option value="3-Piece">3-Piece</option>
                    <option value="2-Piece">2-Piece</option>
                    <option value="Festive Wear">Festive Wear</option>
                    <option value="Formal Wear">Formal Wear</option>
                    <option value="Casual Wear">Casual Wear</option>
                    <option value="Eid Collection">Eid Collection</option>
                    <option value="Embroidered">Embroidered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Fabric *
                  </label>
                  <select
                    value={prodForm.fabric}
                    onChange={(e) => setProdForm({ ...prodForm, fabric: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  >
                    <option value="Lawn">Lawn</option>
                    <option value="Chiffon">Chiffon</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Silk">Silk</option>
                    <option value="Khaddar">Khaddar</option>
                    <option value="Organza">Organza</option>
                    <option value="Velvet">Velvet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Dress Type *
                  </label>
                  <select
                    value={prodForm.dressType}
                    onChange={(e) => setProdForm({ ...prodForm, dressType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  >
                    <option value="Shalwar Qameez">Shalwar Qameez</option>
                    <option value="3 Piece Suit">3 Piece Suit</option>
                    <option value="2 Piece Suit">2 Piece Suit</option>
                    <option value="Kurti & Dupatta">Kurti & Dupatta</option>
                    <option value="Peshwas & Trouser">Peshwas & Trouser</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Embroidery / Work
                  </label>
                  <select
                    value={prodForm.work}
                    onChange={(e) => setProdForm({ ...prodForm, work: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  >
                    <option value="Embroidery">Embroidery</option>
                    <option value="Tilla & Zardozi">Tilla & Zardozi</option>
                    <option value="Digital Print">Digital Print</option>
                    <option value="Hand Embellished">Hand Embellished</option>
                    <option value="Schiffli">Schiffli</option>
                    <option value="Block Print">Block Print</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Occasion
                  </label>
                  <select
                    value={prodForm.occasion}
                    onChange={(e) => setProdForm({ ...prodForm, occasion: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  >
                    <option value="Eid">Eid</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="Formal">Formal</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Color Name & Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={prodForm.color}
                      onChange={(e) => setProdForm({ ...prodForm, color: e.target.value })}
                      placeholder="e.g. Blush Pink"
                      className="w-full px-2.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                    <input
                      type="color"
                      value={prodForm.colorHex}
                      onChange={(e) => setProdForm({ ...prodForm, colorHex: e.target.value })}
                      className="w-10 h-9 p-0.5 border border-stone-300 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Image Selection */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Product Image Asset *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                  {availableSampleImages.map((img) => (
                    <div
                      key={img.path}
                      onClick={() => setProdForm({ ...prodForm, image: img.path })}
                      className={`cursor-pointer rounded border-2 overflow-hidden aspect-3/4 ${
                        prodForm.image === img.path ? 'border-[#800020] ring-1 ring-[#800020]' : 'border-stone-200 opacity-70'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  value={prodForm.image}
                  onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                  placeholder="Custom image path or URL"
                  className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Garment Description & Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  placeholder="Describe the fabric blend, embroidery technique, dupatta border, and styling..."
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 text-xs text-stone-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isFeatured}
                    onChange={(e) => setProdForm({ ...prodForm, isFeatured: e.target.checked })}
                    className="text-[#800020] focus:ring-[#800020]"
                  />
                  <span>Featured Collection Showcase</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodForm.isNewArrival}
                    onChange={(e) => setProdForm({ ...prodForm, isNewArrival: e.target.checked })}
                    className="text-[#800020] focus:ring-[#800020]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DFD4]">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-medium border border-stone-300 rounded text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors"
                >
                  {editingProduct ? 'Save Changes' : 'Add Product to Atelier'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- CONFIRM DELETE PRODUCT MODAL --- */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-stone-200 p-6 space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif-luxury text-xl font-semibold text-stone-900">
                Are you sure you want to delete this product?
              </h3>
              <p className="text-xs text-stone-600 font-light">
                This will permanently remove <strong className="text-stone-900 font-semibold">{productToDelete.name}</strong> from the RANGMAHAL database and the public online store.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3">
              <button
                onClick={() => setProductToDelete(null)}
                className="px-5 py-2.5 text-xs font-medium border border-stone-300 rounded text-stone-700 hover:bg-stone-50 transition-colors"
              >
                No, Keep Product
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-semibold bg-rose-700 text-white rounded hover:bg-rose-800 transition-colors"
              >
                Yes, Delete Product
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
