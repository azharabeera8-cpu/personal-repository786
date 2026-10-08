import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
import { CheckCircle2, ShieldCheck, Truck, ArrowLeft, Building2, CreditCard, Banknote, Sparkles } from 'lucide-react';

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Gujranwala',
  'Sialkot',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Hyderabad',
  'Sukkur',
  'Other City',
];

const PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
];

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    shippingFee,
    discountAmount,
    cartTotal,
    clearCart,
    setCurrentView,
    lastPlacedOrder,
    setLastPlacedOrder,
    showToast,
  } = useStore();

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: '',
    city: 'Lahore',
    province: 'Punjab',
    postalCode: '',
    orderNotes: '',
    paymentMethod: 'COD' as 'COD' | 'Bank Transfer' | 'Online Card',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user placed an order, show clean order confirmation screen
  if (lastPlacedOrder) {
    return (
      <div className="py-16 sm:py-24 bg-[#FAF8F5] min-h-[70vh]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#800020]">
              Mubarak! Order Confirmed
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-stone-900 font-medium mt-1">
              Thank You, {lastPlacedOrder.customerName}
            </h1>
            <p className="text-sm text-stone-600 mt-2 font-light">
              Your RANGMAHAL Eastern order has been safely placed. We are preparing your exquisite outfit with utmost care.
            </p>
          </div>

          <div className="bg-[#FDFBF7] p-6 rounded-xl border border-[#E8DFD4] text-left space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3 text-xs">
              <span className="text-stone-500">Order Reference:</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{lastPlacedOrder.orderNumber}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3 text-xs">
              <span className="text-stone-500">Delivery Address:</span>
              <span className="font-medium text-stone-900 text-right">
                {lastPlacedOrder.address}, {lastPlacedOrder.city}, {lastPlacedOrder.province}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3 text-xs">
              <span className="text-stone-500">Contact Phone:</span>
              <span className="font-mono font-medium text-stone-900">{lastPlacedOrder.customerPhone}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3 text-xs">
              <span className="text-stone-500">Payment Option:</span>
              <span className="font-semibold text-[#800020]">{lastPlacedOrder.paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-base font-bold pt-1">
              <span className="text-stone-800">Total Payable:</span>
              <span className="font-mono tabular-nums text-[#800020]">PKR {lastPlacedOrder.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setCurrentView('shop');
              }}
              className="w-full sm:w-auto px-8 py-3 text-sm font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setCurrentView('home');
              }}
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium bg-white border border-stone-300 text-stone-700 rounded hover:bg-stone-50 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and no placed order
  if (cart.length === 0) {
    return (
      <div className="py-20 text-center bg-[#FAF8F5]">
        <h2 className="font-serif-luxury text-2xl text-stone-800 mb-2">No items to checkout</h2>
        <p className="text-sm text-stone-500 mb-6">Your shopping bag is currently empty.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-6 py-2.5 text-xs font-semibold bg-[#800020] text-white rounded hover:bg-[#671B26]"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.address.trim()) {
      showToast('Please fill all required delivery details', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        image: item.product.image,
        price: item.product.price,
        size: item.selectedSize,
        color: item.product.color,
        quantity: item.quantity,
      }));

      const newOrder = await api.createOrder({
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim() || 'customer@rangmahal.pk',
        customerPhone: formData.customerPhone.trim(),
        address: formData.address.trim(),
        city: formData.city,
        province: formData.province,
        postalCode: formData.postalCode.trim() || '54000',
        orderNotes: formData.orderNotes.trim() || undefined,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingFee,
        discount: discountAmount,
        total: cartTotal,
        paymentMethod: formData.paymentMethod,
        status: 'Pending',
      });

      setLastPlacedOrder(newOrder);
      clearCart();
      showToast('Order placed successfully! A confirmation SMS will be sent.');
    } catch {
      showToast('Could not complete order. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('shop')}
            className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-[#800020] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs font-semibold text-[#800020]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Secure 256-bit Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form Column (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleSubmitOrder} className="space-y-8">
              
              {/* 1. Contact & Customer Info */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-xl border border-[#E8DFD4] shadow-xs space-y-4">
                <h3 className="font-serif-luxury text-xl font-medium text-stone-900 border-b border-[#E8DFD4] pb-3">
                  1. Customer Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Ayesha Khan"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Pakistani Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      placeholder="0300-1234567"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="ayesha@example.com (for order receipt & tracking)"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              {/* 2. Shipping Address */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-xl border border-[#E8DFD4] shadow-xs space-y-4">
                <h3 className="font-serif-luxury text-xl font-medium text-stone-900 border-b border-[#E8DFD4] pb-3">
                  2. Delivery Address in Pakistan
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Complete Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Apartment #, Street, Block, Phase or Town"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      City *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    >
                      {PAKISTANI_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Province *
                    </label>
                    <select
                      value={formData.province}
                      onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                    >
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="e.g. 54000"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Order Delivery Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.orderNotes}
                    onChange={(e) => setFormData({ ...formData, orderNotes: e.target.value })}
                    placeholder="Special instructions for rider (e.g. Call before arrival, leave with gatekeeper)..."
                    className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                  />
                </div>
              </div>

              {/* 3. Payment Method */}
              <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-xl border border-[#E8DFD4] shadow-xs space-y-4">
                <h3 className="font-serif-luxury text-xl font-medium text-stone-900 border-b border-[#E8DFD4] pb-3">
                  3. Payment Method
                </h3>

                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD' ? 'border-[#800020] bg-[#FAF3EC]' : 'border-stone-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'COD' })}
                      className="mt-1 text-[#800020] focus:ring-[#800020]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#800020]" />
                        <span className="font-semibold text-xs sm:text-sm text-stone-900">Cash on Delivery (COD)</span>
                        <span className="text-[10px] bg-[#800020] text-white px-2 py-0.2 rounded font-semibold uppercase">Recommended</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 font-light">
                        Pay in cash to courier agent upon inspection and safe delivery at your doorstep.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Bank Transfer' ? 'border-[#800020] bg-[#FAF3EC]' : 'border-stone-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'Bank Transfer'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'Bank Transfer' })}
                      className="mt-1 text-[#800020] focus:ring-[#800020]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#C5A880]" />
                        <span className="font-semibold text-xs sm:text-sm text-stone-900">Direct Bank Transfer</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 font-light">
                        Meezan Bank / HBL / Bank Alfalah IBAN provided after checkout. WhatsApp proof of transfer.
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                    formData.paymentMethod === 'Online Card' ? 'border-[#800020] bg-[#FAF3EC]' : 'border-stone-200 bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={formData.paymentMethod === 'Online Card'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'Online Card' })}
                      className="mt-1 text-[#800020] focus:ring-[#800020]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#C5A880]" />
                        <span className="font-semibold text-xs sm:text-sm text-stone-900">Credit / Debit Card (Visa, Mastercard, PayPak)</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 font-light">
                        Pay securely with online Pakistani and international banking cards.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-[#800020] hover:bg-[#671B26] text-white text-base font-semibold rounded-lg shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Securing your order...' : `Place Order — PKR ${cartTotal.toLocaleString()}`}
              </button>

            </form>
          </div>

          {/* Order Summary Column (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FDFBF7] p-6 sm:p-8 rounded-xl border border-[#E8DFD4] shadow-xs sticky top-28 space-y-6">
              
              <h3 className="font-serif-luxury text-xl font-medium text-stone-900 border-b border-[#E8DFD4] pb-3">
                Order Summary ({cart.length} {cart.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Itemized List */}
              <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-14 h-16 rounded object-cover bg-stone-100 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 text-xs">
                      <h4 className="font-serif-luxury font-semibold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-stone-500 font-mono">
                        Size: {item.selectedSize} · Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono tabular-nums text-xs font-semibold text-stone-900">
                      PKR {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-[#E8DFD4] space-y-2 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    PKR {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount applied:</span>
                    <span className="font-mono tabular-nums font-semibold">
                      - PKR {discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery (TCS / Leopard):</span>
                  <span className="font-mono tabular-nums font-semibold text-stone-900">
                    {shippingFee === 0 ? 'FREE' : `PKR ${shippingFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-[#E8DFD4] flex justify-between text-base font-bold text-stone-900">
                  <span>Total Amount Payable:</span>
                  <span className="font-mono tabular-nums text-lg text-[#800020]">
                    PKR {cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Box */}
              <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C5A880]" />
                  <span>Dispatched from Lahore Atelier via Express Courier</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                  <span>Guaranteed Original Fabric & Fine Pakistani Stitching</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
