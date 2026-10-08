import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { ShopView } from './components/ShopView';
import { CollectionsView } from './components/CollectionsView';
import { AboutView } from './components/AboutView';
import { FeedbackView } from './components/FeedbackView';
import { ContactView } from './components/ContactView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { ArrowRight, Sparkles, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    products,
    selectedProduct,
    setSelectedProduct,
    quickViewProduct,
    setQuickViewProduct,
    setSelectedCategory,
  } = useStore();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 6);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  // If in admin dashboard, render admin view without customer header/footer
  if (currentView === 'admin-dashboard') {
    return (
      <div className="min-h-screen bg-[#F5F2EB]">
        <AdminDashboard />
        <Toast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* Top Header */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="animate-fadeIn">
            {/* 1. Hero Campaign Focal Point */}
            <Hero />

            {/* 2. Categories Showcase */}
            <CategoriesSection />

            {/* 3. Featured Eastern Collection Grid */}
            <section className="py-16 sm:py-20 bg-[#FAF8F5] border-t border-[#E8DFD4]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880] mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Curated by Master Artisans</span>
                    </div>
                    <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
                      Signature Festive & Lawn Suits
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentView('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#800020] hover:text-[#671B26] transition-colors"
                  >
                    <span>View All Creations ({products.length})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* 3-column desktop / 2-column tablet grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {featuredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Promotional Story Spotlight Banner */}
                <div className="mt-16 bg-[#F5EFE6] rounded-2xl border border-[#E0D6C8] p-8 sm:p-12 overflow-hidden relative">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-8 space-y-4">
                      <span className="text-xs font-semibold uppercase tracking-widest text-[#800020]">
                        Craftsmanship Spotlight
                      </span>
                      <h3 className="font-serif-luxury text-2xl sm:text-3xl text-stone-900 font-medium leading-snug">
                        Antique Tilla & Pure Chiffon Dupattas
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-2xl">
                        Each thread of our zardozi embellishment is gently placed by generational karigars in Lahore. 
                        We blend heirloom subcontinental motifs with lightweight luxury fabrics designed for lasting celebrations.
                      </p>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedCategory('Eid Collection');
                            setCurrentView('shop');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors inline-flex items-center gap-2 shadow-xs cursor-pointer"
                        >
                          <span>Explore Eid & Festive Collection</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-4 flex justify-center">
                      <div className="w-48 h-56 rounded-xl overflow-hidden shadow-lg border border-[#D5C7B8]">
                        <img
                          src="/src/assets/images/category_embroidery_craft_1791444062545.jpg"
                          alt="Detail of intricate Pakistani embroidery"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* 4. Trust Assurance Bar */}
            <section className="py-10 bg-[#F7F3EC] border-t border-b border-[#E8DFD4]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-xs">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-stone-900">Nationwide Express Delivery</h4>
                      <p className="text-[11px] text-stone-500 font-light">Dispatched to 250+ Pakistani cities & towns</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-xs">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-stone-900">Cash on Delivery (COD)</h4>
                      <p className="text-[11px] text-stone-500 font-light">Pay only when you receive your package</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#800020] shadow-xs">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-stone-900">7-Day Hassle-Free Exchange</h4>
                      <p className="text-[11px] text-stone-500 font-light">Guaranteed size and fabric satisfaction</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'shop' && <ShopView />}
        {currentView === 'collections' && <CollectionsView />}
        {currentView === 'about' && <AboutView />}
        {currentView === 'feedback' && <FeedbackView />}
        {currentView === 'contact' && <ContactView />}
        {currentView === 'checkout' && <CheckoutView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isQuickView={false}
      />

      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        isQuickView={true}
      />

      <CartDrawer />
      <AdminLoginModal />
      <CustomerAuthModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
