import React, { useState, useEffect } from 'react';
import { Product, ProductReview } from '../types';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { X, Heart, ShoppingBag, Star, Shield, Truck, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isQuickView?: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isQuickView = false,
}) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    showToast,
  } = useStore();

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Review form states
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewerRating, setReviewerRating] = useState(5);
  const [reviewerComment, setReviewerComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes[0] || 'M');
      setQuantity(1);
      // Fetch reviews
      api.getReviews(product.id).then((revs) => setReviews(revs));
    }
  }, [product]);

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    onClose();
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewerComment.trim()) {
      showToast('Please provide your name and review feedback', 'error');
      return;
    }

    setSubmittingReview(true);
    try {
      const newRev = await api.addReview({
        productId: product.id,
        customerName: reviewerName.trim(),
        city: reviewerCity.trim() || 'Pakistan',
        rating: reviewerRating,
        comment: reviewerComment.trim(),
      });
      setReviews([newRev, ...reviews]);
      setShowReviewForm(false);
      setReviewerName('');
      setReviewerCity('');
      setReviewerComment('');
      showToast('Thank you! Your verified review has been posted.');
    } catch {
      showToast('Failed to post review. Please try again.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8DFD4] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD4] bg-[#FDFBF7]">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#800020]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>RANGMAHAL Eastern Atelier · {product.productCode}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column (5 cols) */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-3/4 rounded-lg overflow-hidden bg-[#F2EDE4] border border-[#E8DFD4]">
                <img
                  src={activeImage || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Thumbnails */}
              {product.galleryImages && product.galleryImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-20 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === img ? 'border-[#800020] ring-1 ring-[#800020]' : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Purchase & Details Column (6 cols) */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                {/* Unboxed Metadata (Zero-pill discipline) */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
                  <span className="font-semibold text-[#800020] uppercase tracking-wider">{product.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.fabric}</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.dressType}</span>
                </div>

                <h2 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-stone-900 mb-1">
                  {product.name}
                </h2>
                
                {product.subtitle && (
                  <p className="text-sm text-stone-600 mb-3 italic font-serif">
                    {product.subtitle}
                  </p>
                )}

                {/* Rating & reviews link */}
                <div className="flex items-center gap-2 text-sm text-stone-600 mb-4">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(product.rating)
                            ? 'fill-[#D4AF37] text-[#D4AF37]'
                            : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-stone-400 text-xs">({reviews.length} customer reviews)</span>
                </div>

                {/* Pricing module */}
                <div className="flex items-baseline gap-3 p-3.5 bg-[#F7F3EC] rounded-lg border border-[#EBE4DC] mb-5">
                  <span className="font-mono tabular-nums text-2xl font-bold text-[#800020]">
                    PKR {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="font-mono tabular-nums text-sm text-stone-400 line-through">
                      PKR {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-sm text-stone-700 leading-relaxed mb-6 font-light">
                  {product.description}
                </p>

                {/* Eastern Specifications Table */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3.5 rounded-lg border border-[#E8DFD4] mb-6">
                  <div>
                    <span className="text-stone-400 block font-medium">Fabric:</span>
                    <span className="font-semibold text-stone-800">{product.fabric}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Work / Detailing:</span>
                    <span className="font-semibold text-stone-800">{product.work}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Occasion:</span>
                    <span className="font-semibold text-stone-800">{product.occasion}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block font-medium">Color:</span>
                    <span className="font-semibold text-stone-800 flex items-center gap-1.5 mt-0.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block border" style={{ backgroundColor: product.colorHex }} />
                      {product.color}
                    </span>
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-stone-700 uppercase tracking-wider">Select Size (Pakistani Fit):</span>
                    <span className="text-stone-400">Regular Eastern Stitching</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-10 rounded text-xs font-medium font-mono transition-all ${
                          selectedSize === sz
                            ? 'bg-[#800020] text-white shadow-sm ring-1 ring-[#800020]'
                            : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Stepper & Stock */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-stone-300 rounded bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-mono text-sm text-stone-900 font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-5 bg-[#800020] hover:bg-[#671B26] text-white text-sm font-semibold rounded shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </button>

                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`p-3 rounded border transition-colors ${
                        inWishlist
                          ? 'border-[#800020] bg-rose-50 text-[#800020]'
                          : 'border-stone-300 bg-white text-stone-700 hover:text-[#800020]'
                      }`}
                      title="Wishlist"
                    >
                      <Heart className={`w-5 h-5 ${inWishlist ? 'fill-[#800020]' : ''}`} />
                    </button>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-5 bg-[#4E0E1B] hover:bg-[#340911] text-white text-sm font-semibold rounded shadow transition-colors cursor-pointer"
                  >
                    Buy Now with Cash on Delivery
                  </button>
                </div>

                {/* Trust Markers */}
                <div className="pt-5 mt-5 border-t border-stone-200 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-500">
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-[#C5A880]" />
                    <span>Free Shipping &gt; 5k</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Shield className="w-4 h-4 text-[#C5A880]" />
                    <span>100% Authentic Fabric</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-[#C5A880]" />
                    <span>7-Day Easy Exchange</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-[#E8DFD4]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif-luxury text-xl font-medium text-stone-900">
                  Customer Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500">Read what Pakistani women say about this dress</p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="text-xs font-semibold tracking-wider uppercase text-[#800020] hover:underline"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="bg-[#F7F3EC] p-5 rounded-lg border border-[#E8DFD4] mb-6 space-y-4">
                <h4 className="text-sm font-semibold text-stone-900">Share your experience</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      placeholder="e.g. Maham Tariq"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">City (e.g. Lahore, Karachi)</label>
                    <input
                      type="text"
                      value={reviewerCity}
                      onChange={(e) => setReviewerCity(e.target.value)}
                      placeholder="Lahore"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setReviewerRating(s)}
                        className="p-1 text-stone-400 hover:text-[#D4AF37]"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= reviewerRating ? 'fill-[#D4AF37] text-[#D4AF37]' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Your Review *</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewerComment}
                    onChange={(e) => setReviewerComment(e.target.value)}
                    placeholder="Describe fabric softness, embroidery quality, fitting and delivery..."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submittingReview ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 italic">No customer reviews yet. Be the first to review this design!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-white rounded-lg border border-[#EBE4DC] space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-stone-900">{rev.customerName}</span>
                        <span className="text-stone-400 text-xs">({rev.city})</span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                          <Check className="w-3 h-3" /> Verified Buyer
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#D4AF37]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-light">{rev.comment}</p>
                    <div className="text-[10px] font-mono text-stone-400">{rev.createdAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
