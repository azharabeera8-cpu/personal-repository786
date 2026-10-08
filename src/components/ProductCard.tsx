import React, { useState } from 'react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    openProductDetail,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [imageError, setImageError] = useState(false);
  const inWishlist = isInWishlist(product.id);

  // Formatting currency in Pakistani Rupees
  const formattedPrice = `PKR ${product.price.toLocaleString()}`;
  const formattedOriginalPrice = product.originalPrice
    ? `PKR ${product.originalPrice.toLocaleString()}`
    : null;

  return (
    <div className="group relative flex flex-col bg-[#FDFBF7] border border-[#EBE4DC] rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      
      {/* 1. Image Container (takes ~68% of card height) */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F2EDE4]">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-104 cursor-pointer"
            onClick={() => openProductDetail(product)}
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center cursor-pointer bg-gradient-to-b from-[#FAF8F5] to-[#EFEAE2]"
            onClick={() => openProductDetail(product)}
          >
            <span className="font-serif-luxury text-base text-[#4E0E1B] font-medium">{product.name}</span>
            <span className="text-xs text-stone-500 mt-1">{product.fabric} · {product.dressType}</span>
          </div>
        )}

        {/* Wishlist Button (Top Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/85 backdrop-blur-xs text-stone-700 hover:text-[#800020] transition-colors shadow-xs z-10"
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-[#800020] text-[#800020]' : ''}`} />
        </button>

        {/* Discount Tag (Quiet text kicker, top-left) */}
        {product.discountPercent && (
          <div className="absolute top-3 left-3 bg-[#4E0E1B] text-[#FAF8F5] text-[11px] font-semibold tracking-wider px-2 py-0.5 rounded uppercase">
            {product.discountPercent}% OFF
          </div>
        )}

        {/* Hover Quick Action Drawer */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="flex-1 py-2 px-3 bg-white/95 backdrop-blur-xs hover:bg-white text-stone-900 text-xs font-semibold rounded shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product, product.sizes[0] || 'M', 1);
            }}
            className="py-2 px-3 bg-[#800020] hover:bg-[#671B26] text-white text-xs font-semibold rounded shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Quick Add to Bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Metadata Section (Zero-Pill discipline: unboxed text with typographic separators) */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        
        <div>
          {/* Category & Fabric quiet kicker */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
            <span className="font-medium text-[#800020]">{product.category}</span>
            <span aria-hidden="true">·</span>
            <span>{product.fabric}</span>
            <span aria-hidden="true">·</span>
            <span>{product.dressType}</span>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => openProductDetail(product)}
            className="font-serif-luxury text-base font-semibold text-stone-900 group-hover:text-[#800020] transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Color & sizes overview */}
          <div className="flex items-center justify-between text-xs text-stone-500 mt-1">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full border border-stone-300 inline-block"
                style={{ backgroundColor: product.colorHex || '#A020F0' }}
                title={product.color}
              />
              <span>{product.color}</span>
            </div>
            
            <div className="text-[11px] font-mono tracking-tight text-stone-400">
              {product.sizes.join(' · ')}
            </div>
          </div>
        </div>

        {/* 3. Pricing & Rating baseline */}
        <div className="pt-2 border-t border-[#F0E9DF] flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-mono tabular-nums text-sm sm:text-base font-bold text-stone-900">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="font-mono tabular-nums text-xs text-stone-400 line-through">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
            <span className="font-mono tabular-nums font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-stone-400 text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

      </div>

    </div>
  );
};
