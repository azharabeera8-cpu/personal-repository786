import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
    openProductDetail,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const freeShippingThreshold = 5000;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs transition-opacity animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#E8DFD4] shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E8DFD4] bg-[#FDFBF7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#800020]" />
              <h2 className="font-serif-luxury text-xl font-medium text-stone-900">
                Shopping Bag ({cart.length})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-200 transition-colors"
              aria-label="Close Shopping Bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-[#F4EDE4] border-b border-[#E8DFD4] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-700 mb-1.5 font-light">
                Add <span className="font-semibold font-mono text-[#800020]">PKR {remainingForFreeShipping.toLocaleString()}</span> more for <span className="font-medium">Free Delivery</span>
              </p>
            ) : (
              <p className="text-emerald-800 font-medium mb-1.5 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>You unlocked Complimentary Nationwide Shipping!</span>
              </p>
            )}
            <div className="w-full bg-stone-300 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#800020] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg text-stone-800 mb-1">Your bag is empty</h3>
                  <p className="text-xs text-stone-500 max-w-xs font-light">
                    Explore our exquisite Eastern lawn, chiffon, and festive collections to add your favorites.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-4 p-3 bg-white rounded-lg border border-[#EBE4DC] transition-all hover:border-[#D5C7B8]"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded bg-[#F2EDE4] shrink-0 cursor-pointer"
                    onClick={() => {
                      setIsCartOpen(false);
                      openProductDetail(item.product);
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          onClick={() => {
                            setIsCartOpen(false);
                            openProductDetail(item.product);
                          }}
                          className="font-serif-luxury text-sm font-semibold text-stone-900 hover:text-[#800020] transition-colors cursor-pointer line-clamp-1"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                        <span>Size: <strong className="text-stone-800 font-mono">{item.selectedSize}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>{item.product.color}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-200 rounded bg-[#FAF8F5] text-xs">
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.quantity - 1)
                          }
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-1 font-mono font-medium text-stone-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCartQuantity(item.product.id, item.selectedSize, item.quantity + 1)
                          }
                          className="px-2 py-1 text-stone-600 hover:bg-stone-200"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono tabular-nums text-sm font-bold text-[#800020]">
                        PKR {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E8DFD4] bg-[#FDFBF7] space-y-4">
              
              {/* Coupon Form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{coupon.code}</strong> applied ({coupon.discountPercent}% OFF)</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-600 font-medium text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter Coupon (e.g. RANG10)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold bg-stone-800 text-white rounded hover:bg-stone-900 transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Order Calculations */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">
                    PKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums font-medium">
                      - PKR {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Nationwide Shipping</span>
                  <span className="font-mono tabular-nums font-medium text-stone-900">
                    {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between text-base font-bold text-stone-900">
                  <span>Total Amount</span>
                  <span className="font-mono tabular-nums text-[#800020]">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-6 bg-[#800020] hover:bg-[#671B26] text-white text-sm font-semibold rounded shadow flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCartOpen(false)}
                className="w-full text-center text-xs text-stone-500 hover:text-stone-800 transition-colors py-1"
              >
                Continue Shopping
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
