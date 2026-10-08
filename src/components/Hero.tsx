import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { setCurrentView, setSelectedCategory } = useStore();

  const handleShopNow = () => {
    setSelectedCategory('All');
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreCollections = () => {
    setCurrentView('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E8DFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Text Column: 60-30-10 color discipline & typographic hierarchy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-[0.25em] text-[#C5A880] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Eastern Heritage Collection 2026</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.12] text-[#2A1116] tracking-tight">
              Elegance Woven in Every Thread
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-light leading-relaxed max-w-xl">
              Discover timeless Pakistani fashion with RANGMAHAL. From handcrafted pure lawn 
              to celebratory zardozi festive silks, celebrate Eastern grace tailored for the contemporary Pakistani woman.
            </p>

            {/* Editorial Features - Clean unboxed text with typographic bullet separators */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-stone-500 pt-1">
              <span>Pure Authentic Lawn & Chiffon</span>
              <span aria-hidden="true" className="text-[#C5A880]">·</span>
              <span>Intricate Hand Embroidery</span>
              <span aria-hidden="true" className="text-[#C5A880]">·</span>
              <span>Nationwide Cash on Delivery</span>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={handleShopNow}
                className="px-7 py-3.5 text-sm font-medium tracking-wide text-[#FAF8F5] bg-[#800020] hover:bg-[#671B26] transition-all rounded shadow-sm hover:shadow flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleExploreCollections}
                className="px-7 py-3.5 text-sm font-medium tracking-wide text-[#4E0E1B] bg-transparent border border-[#C5A880] hover:bg-[#F5EFE6] transition-all rounded cursor-pointer"
              >
                Explore Collection
              </button>
            </div>
          </div>

          {/* Right Visual Frame: High-Fidelity Pakistani Eastern Fashion Hero */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Subtle gold accent frame border */}
              <div className="absolute -inset-2 rounded-2xl border border-[#D4AF37]/30 transform rotate-1 pointer-events-none" />
              
              <div className="relative overflow-hidden rounded-xl shadow-xl aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 bg-[#EAE2D8]">
                <img
                  src="/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg"
                  alt="RANGMAHAL Eastern Pakistani Fashion Model wearing regal embroidered Shalwar Qameez"
                  className="w-full h-full object-cover object-center transform hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  loading="eager"
                />
                
                {/* Measured Scrim for contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />
                
                {/* Quiet caption tag */}
                <div className="absolute bottom-5 left-5 right-5 text-[#FAF8F5] flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#E8DFD4] font-medium">Signature Series</p>
                    <p className="font-serif-luxury text-lg sm:text-xl font-medium tracking-wide">Rang-e-Gulab Royal Ensemble</p>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-[#FAF8F5]/90">PKR 6,999</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
