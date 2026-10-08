import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowUpRight } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  filterKey: string;
  image: string;
  description: string;
  tag: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Eid Collection',
    filterKey: 'Eid Collection',
    image: '/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg',
    description: 'Regal festive ensembles adorned with antique tilla and silk dupattas',
    tag: 'Festive 2026'
  },
  {
    id: 'cat-2',
    name: 'Lawn Collection',
    filterKey: 'Lawn',
    image: '/src/assets/images/product_lawn_gulab_suit_1791444014404.jpg',
    description: 'Breathable luxury spring & summer lawn with intricate floral threadwork',
    tag: 'Bestseller'
  },
  {
    id: 'cat-3',
    name: 'Festive Wear',
    filterKey: 'Festive Wear',
    image: '/src/assets/images/product_festive_emerald_1791444031532.jpg',
    description: 'Chiffon & net suits rich in zardozi embroidery for wedding celebrations',
    tag: 'Royal Grace'
  },
  {
    id: 'cat-4',
    name: 'Formal Wear',
    filterKey: 'Formal Wear',
    image: '/src/assets/images/product_royal_blue_suit_1791444049528.jpg',
    description: 'Sophisticated raw silk & organza suits tailored for evening galas',
    tag: 'Evening Luxe'
  },
  {
    id: 'cat-5',
    name: 'Embroidered Collection',
    filterKey: 'Embroidered',
    image: '/src/assets/images/category_embroidery_craft_1791444062545.jpg',
    description: 'Master craftsmanship highlighting centuries of Pakistani thread art',
    tag: 'Handcrafted'
  },
  {
    id: 'cat-6',
    name: 'Casual Wear',
    filterKey: 'Casual Wear',
    image: '/src/assets/images/hero_rangmahal_fashion_1791443997573.jpg',
    description: 'Everyday comfortable 2-piece and 3-piece breathable cotton kurtas',
    tag: 'Daily Ease'
  },
  {
    id: 'cat-7',
    name: '3-Piece Suits',
    filterKey: '3-Piece',
    image: '/src/assets/images/product_lawn_gulab_suit_1791444014404.jpg',
    description: 'Complete timeless Eastern sets with matching shalwar and dupatta',
    tag: 'Complete Sets'
  },
  {
    id: 'cat-8',
    name: 'New Arrivals',
    filterKey: 'All',
    image: '/src/assets/images/product_festive_emerald_1791444031532.jpg',
    description: 'Fresh seasonal drops straight from the RANGMAHAL design studio',
    tag: 'Just In'
  },
];

export const CategoriesSection: React.FC = () => {
  const { setSelectedCategory, setCurrentView, resetFilters, setSortBy } = useStore();

  const handleCategorySelect = (item: CategoryItem) => {
    resetFilters();
    if (item.name === 'New Arrivals') {
      setSortBy('newest');
    } else {
      setSelectedCategory(item.filterKey);
    }
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-20 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
            Curated Eastern Wardrobe
          </p>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
            Explore By Category
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-3 mb-4" />
          <p className="text-sm sm:text-base text-stone-600 font-light">
            From breezy summer lawn to opulent wedding festive wear, discover our signature silhouettes crafted with reverence for Pakistani tradition.
          </p>
        </div>

        {/* 4-column responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat)}
              className="group relative overflow-hidden rounded-lg bg-[#F5EFE6] border border-[#E8DFD4] cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              {/* Image Frame */}
              <div className="relative aspect-3/4 overflow-hidden bg-stone-200">
                <img
                  src={cat.image}
                  alt={`Pakistani women dress category: ${cat.name}`}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-opacity" />
                
                {/* Subtle top indicator */}
                <div className="absolute top-3 left-3 text-[11px] font-medium tracking-wider uppercase text-[#FAF8F5]/90 bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded">
                  {cat.tag}
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-[#FAF8F5]">
                  <h3 className="font-serif-luxury text-xl font-medium tracking-wide mb-1 text-white group-hover:text-[#F7E7CE] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-2 font-light mb-3">
                    {cat.description}
                  </p>
                  
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#FAF8F5] group-hover:text-[#F7E7CE]">
                    <span>Shop Now</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
