import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CollectionsView: React.FC = () => {
  const { setSelectedCategory, setCurrentView, resetFilters } = useStore();

  const collections = [
    {
      title: 'Eid Mubarak Luxury 2026',
      tagline: 'Timeless Opulence for Celebratory Days',
      description: 'Hand-worked tilla and zardozi embroidery layered over pure chiffon, organza, and raw silk. Designed to bring royal grandeur to your festive gatherings.',
      image: '/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg',
      category: 'Eid Collection',
      priceRange: 'From PKR 7,999',
    },
    {
      title: 'Spring Summer Lawn Splendor',
      tagline: 'Breathable Poetry in Pastel & Floral Hues',
      description: 'Crafted from pure superfine combed Pakistani cotton lawn, featuring floral cross-stitch embroidery and lightweight silk and chiffon dupattas.',
      image: '/src/assets/images/product_lawn_gulab_suit_1791444014404.jpg',
      category: 'Lawn',
      priceRange: 'From PKR 5,499',
    },
    {
      title: 'Royal Wedding & Shehnai Festive',
      tagline: 'Heritage Craftsmanship for Memorable Nights',
      description: 'Rich jewel tones—deep emerald, royal blue, ruby red, and antique gold. Featuring delicate dabka, sequins, and marori borders for bridal guests.',
      image: '/src/assets/images/product_festive_emerald_1791444031532.jpg',
      category: 'Festive Wear',
      priceRange: 'From PKR 12,999',
    },
    {
      title: 'Everyday Traditional Cotton & Khaddar',
      tagline: 'Graceful Comfort for the Modern Pakistani Woman',
      description: 'Comfortable 2-piece and 3-piece casual Shalwar Qameez ensembles with digital botanical prints and breathable weaves suitable for daily wear.',
      image: '/src/assets/images/product_royal_blue_suit_1791444049528.jpg',
      category: 'Casual Wear',
      priceRange: 'From PKR 3,499',
    },
  ];

  const handleSelectCollection = (category: string) => {
    resetFilters();
    setSelectedCategory(category);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#C5A880] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Eastern Editions</span>
          </div>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
            The RANGMAHAL Collections
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2 mb-3" />
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Every collection tells a chapter of Pakistani craftsmanship—from Lahore’s intricate thread studios to the grand courtyards of the Mughal era.
          </p>
        </div>

        {/* Collections Stack */}
        <div className="space-y-12">
          {collections.map((col, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <div
                key={col.title}
                className="bg-[#FDFBF7] rounded-xl border border-[#E8DFD4] overflow-hidden shadow-xs hover:shadow-md transition-shadow"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                  isReversed ? 'lg:flex-row-reverse' : ''
                }`}>
                  
                  {/* Image Column (6 cols) */}
                  <div className={`lg:col-span-6 overflow-hidden ${isReversed ? 'lg:order-2' : ''}`}>
                    <div className="aspect-16/10 lg:aspect-4/3 w-full bg-[#EAE2D8] overflow-hidden">
                      <img
                        src={col.image}
                        alt={col.title}
                        className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  {/* Content Column (6 cols) */}
                  <div className={`p-8 lg:p-12 lg:col-span-6 space-y-4 ${isReversed ? 'lg:order-1' : ''}`}>
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#800020]">
                      {col.priceRange}
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl text-stone-900 font-medium">
                      {col.title}
                    </h2>
                    <p className="text-sm font-serif italic text-[#C5A880]">
                      {col.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
                      {col.description}
                    </p>

                    <div className="pt-4">
                      <button
                        onClick={() => handleSelectCollection(col.category)}
                        className="px-6 py-3 text-xs sm:text-sm font-semibold tracking-wide bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                      >
                        <span>Explore {col.category}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
