import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, RotateCcw, Search, Sparkles } from 'lucide-react';

const CATEGORIES = ['All', 'Lawn', '3-Piece', '2-Piece', 'Festive Wear', 'Formal Wear', 'Casual Wear', 'Eid Collection', 'Embroidered'];
const FABRICS = ['All', 'Lawn', 'Cotton', 'Chiffon', 'Silk', 'Khaddar', 'Organza', 'Velvet'];
const OCCASIONS = ['All', 'Casual', 'Formal', 'Festive', 'Wedding', 'Eid'];
const SIZES = ['All', 'XS', 'S', 'M', 'L', 'XL'];
const COLORS = [
  'All',
  'Deep Maroon',
  'Emerald Green',
  'Royal Blue',
  'Peach',
  'Blush Pink',
  'Mustard',
  'Off White',
  'Midnight Black',
  'Lavender',
  'Teal Green',
];

export const ShopView: React.FC = () => {
  const {
    filteredProducts,
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
  } = useStore();

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All' ||
    selectedOccasion !== 'All' ||
    selectedFabric !== 'All' ||
    selectedColor !== 'All' ||
    selectedSize !== 'All' ||
    sortBy !== 'featured';

  return (
    <div className="py-10 sm:py-14 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-[#C5A880] font-semibold mb-2">
            The Complete Atelier Collection
          </p>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#2A1116] font-normal tracking-tight">
            Pakistani Eastern Dresses
          </h1>
          <div className="w-12 h-0.5 bg-[#C5A880] mx-auto mt-2 mb-3" />
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Browse authentic 2-Piece & 3-Piece Pakistani ensembles. Handcrafted embroidery, breathable seasonal fabrics, and celebratory festive styles.
          </p>
        </div>

        {/* Top Control Bar: Search input, Sort, Mobile Filter toggle */}
        <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#E8DFD4] mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lawn, silk, embroidery..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-stone-300 rounded text-xs font-semibold text-stone-700"
            >
              <Filter className="w-3.5 h-3.5 text-[#800020]" />
              <span>Filters ({hasActiveFilters ? 'Active' : 'All'})</span>
            </button>

            {/* Product Count */}
            <div className="text-xs text-stone-500 font-mono hidden sm:block">
              Showing <strong className="text-stone-900 font-bold">{filteredProducts.length}</strong> creations
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white border border-stone-300 rounded text-stone-800 text-xs font-medium focus:outline-none focus:border-[#800020]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">New Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Best Customer Rating</option>
              </select>
            </div>
          </div>

        </div>

        {/* Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Filter Sidebar */}
          <div className={`md:col-span-3 space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="bg-[#FDFBF7] p-5 rounded-xl border border-[#E8DFD4] shadow-xs space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-900">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#800020]" />
                  <span>Filter Garments</span>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-[#800020] hover:underline flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
                  Category
                </h4>
                <div className="space-y-1 text-xs">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left py-1.5 px-2 rounded transition-colors ${
                        selectedCategory === cat
                          ? 'bg-[#800020] text-white font-medium'
                          : 'text-stone-600 hover:bg-[#F2EDE4] hover:text-stone-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fabric Filter */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
                  Fabric Type
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {FABRICS.map((fab) => (
                    <button
                      key={fab}
                      onClick={() => setSelectedFabric(fab)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        selectedFabric === fab
                          ? 'bg-[#4E0E1B] text-white font-semibold'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion Filter */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
                  Occasion
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`px-2.5 py-1 text-xs rounded transition-colors ${
                        selectedOccasion === occ
                          ? 'bg-[#800020] text-white font-semibold'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
                  Size (Fit)
                </h4>
                <div className="flex items-center gap-1.5">
                  {SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-9 h-8 rounded text-xs font-mono transition-colors ${
                        selectedSize === sz
                          ? 'bg-[#800020] text-white font-bold'
                          : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div>
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider mb-2.5">
                  Color Shade
                </h4>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded text-xs text-stone-800 focus:outline-none focus:border-[#800020]"
                >
                  {COLORS.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Right Product Grid (9 cols) */}
          <div className="md:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#FDFBF7] rounded-xl border border-[#E8DFD4] space-y-4">
                <p className="font-serif-luxury text-xl text-stone-800">
                  No matching Pakistani garments found
                </p>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try adjusting your fabric, occasion, or price filters, or clear your search query to see all RANGMAHAL designs.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26]"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
