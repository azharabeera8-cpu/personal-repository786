import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, HeartHandshake, ShieldCheck, Gem } from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="py-14 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero About Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The RANGMAHAL Atelier Story</span>
            </div>
            
            <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl text-[#2A1116] font-normal leading-tight">
              Where Pakistani Tradition Meets Modern Grace
            </h1>
            
            <div className="w-16 h-0.5 bg-[#C5A880]" />

            <blockquote className="border-l-2 border-[#800020] pl-4 text-base sm:text-lg text-stone-800 font-serif italic">
              "RANGMAHAL celebrates the beauty of Pakistani women through timeless Eastern fashion. 
              Our collections combine traditional Pakistani craftsmanship with modern elegance. 
              From everyday Shalwar Qameez to festive and formal wear, we create outfits that make every 
              woman feel confident, graceful and beautiful."
            </blockquote>

            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Founded in Lahore, the historic cultural heartbeat of Pakistan, RANGMAHAL was born out of 
              a devotion to reviving centuries-old subcontinental textile techniques. We work closely 
              with master karigars (artisans) specializing in hand-embroidery, zardozi, tilla, and schiffli work.
            </p>

            <button
              onClick={() => {
                setCurrentView('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-7 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors"
            >
              Discover Our Creations
            </button>
          </div>

          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-3/4 rounded-xl overflow-hidden bg-stone-200 shadow-md">
                <img
                  src="/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg"
                  alt="Pakistani Eastern Fashion Editorial"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="aspect-3/4 rounded-xl overflow-hidden bg-stone-200 shadow-md mt-8">
                <img
                  src="/src/assets/images/category_embroidery_craft_1791444062545.jpg"
                  alt="Pakistani hand embroidery craftsmanship"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Pillars */}
        <div className="pt-8 border-t border-[#E8DFD4]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-stone-900 font-medium">
              Our Craftsmanship Pillars
            </h2>
            <p className="text-xs text-stone-500 mt-1">Honoring the heritage of Eastern garment-making</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#E8DFD4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF3EC] flex items-center justify-center text-[#800020]">
                <Gem className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                100% Authentic Fabrics
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                We handpick breathable superfine lawn, pure silk, organza, and micro-velvets. Every bolt of fabric is tested for colorfastness and comfort in the Pakistani climate.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#E8DFD4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF3EC] flex items-center justify-center text-[#800020]">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                Honoring Pakistani Karigars
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Our embroidery studios support ethical employment for skilled artisans, preserving traditional techniques like resham threadwork, gota patti, and antique tilla.
              </p>
            </div>

            <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#E8DFD4] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#FAF3EC] flex items-center justify-center text-[#800020]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
                Impeccable Eastern Cut
              </h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Tailored with traditional drape and modern fit. From classic flowing Shalwars to straight cigarette trousers and majestic peshwas silhouettes.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
