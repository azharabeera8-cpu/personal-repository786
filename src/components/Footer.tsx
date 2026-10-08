import React from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { Sparkles, Phone, Mail, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, setSortBy, resetFilters } = useStore();

  const handleLink = (view: AppView, cat?: string) => {
    resetFilters();
    if (cat === 'New Arrivals') {
      setSortBy('newest');
      setCurrentView('shop');
    } else if (cat) {
      setSelectedCategory(cat);
      setCurrentView('shop');
    } else {
      setCurrentView(view);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2A080F] text-[#FAF8F5] border-t border-[#4E0E1B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.24em] text-[#FAF8F5] block uppercase">
              RANGMAHAL
            </span>
            <p className="text-xs font-serif italic text-[#C5A880] tracking-wide">
              "Where Tradition Meets Elegance."
            </p>
            <p className="text-xs text-stone-300 font-light leading-relaxed max-w-sm">
              RANGMAHAL is a premier Pakistani women’s Eastern fashion house. We celebrate the timeless splendor of subcontinental craftsmanship with handcrafted pure lawn, silk, and festive formals.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2 text-[#C5A880]">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                title="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-[#C5A880] text-[11px]">
              Explore Atelier
            </h4>
            <ul className="space-y-2 text-stone-300 font-light">
              <li>
                <button onClick={() => handleLink('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop')} className="hover:text-white transition-colors">
                  All Dresses
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', 'New Arrivals')} className="hover:text-white transition-colors">
                  New Arrivals
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('collections')} className="hover:text-white transition-colors">
                  Signature Collections
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('about')} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('feedback')} className="hover:text-white transition-colors">
                  Client Feedback
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Eastern Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-[#C5A880] text-[11px]">
              Eastern Collections
            </h4>
            <ul className="space-y-2 text-stone-300 font-light">
              <li>
                <button onClick={() => handleLink('shop', 'Eid Collection')} className="hover:text-white transition-colors">
                  Eid Mubarak Festive
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', 'Lawn')} className="hover:text-white transition-colors">
                  Luxury Embroidered Lawn
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', 'Festive Wear')} className="hover:text-white transition-colors">
                  Chiffon Wedding Formals
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', '3-Piece')} className="hover:text-white transition-colors">
                  3-Piece Shalwar Qameez
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', 'Casual Wear')} className="hover:text-white transition-colors">
                  Pure Cotton 2-Piece Sets
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('shop', 'Embroidered')} className="hover:text-white transition-colors">
                  Chikankari & Schiffli Edits
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge (3 cols) */}
          <div className="lg:col-span-3 space-y-3 text-xs">
            <h4 className="font-semibold uppercase tracking-wider text-[#C5A880] text-[11px]">
              Concierge & Policies
            </h4>
            <div className="space-y-2.5 text-stone-300 font-light">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </p>
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>+92 42 3578 9012</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                <span>care@rangmahal.pk</span>
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-stone-400 space-y-1">
              <p>• Nationwide Cash on Delivery (COD)</p>
              <p>• 7-Day Easy Exchange Policy</p>
              <p>• Dispatched via TCS & Leopard Couriers</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Assurance */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-light">
          <p>© 2026 RANGMAHAL. All Rights Reserved.</p>
          
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-stone-500">Accepted Across Pakistan:</span>
            <span className="font-semibold text-stone-300">Cash on Delivery</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">Bank Transfer</span>
            <span aria-hidden="true" className="text-stone-600">·</span>
            <span className="text-stone-300">Visa / Mastercard / PayPak</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
