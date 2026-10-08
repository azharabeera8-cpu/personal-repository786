import React, { useState } from 'react';
import { useStore, AppView } from '../context/StoreContext';
import { Search, Heart, ShoppingBag, User, ShieldCheck, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    isAdminLoggedIn,
    setIsAdminModalOpen,
    setIsCustomerAuthModalOpen,
    currentUser,
  } = useStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; view: AppView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'Shop', view: 'shop' },
    { label: 'Collections', view: 'collections' },
    { label: 'About Us', view: 'about' },
    { label: 'Feedback', view: 'feedback' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top micro announcement bar */}
      <div className="bg-[#4E0E1B] text-[#FAF8F5] text-xs py-1.5 px-4 text-center tracking-wider border-b border-[#671B26]">
        <span>Complimentary Express Shipping on Orders Above PKR 5,000 across Pakistan</span>
      </div>

      {/* Main Top Navigation: Strict 3-zone contract */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD4] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-stone-800 p-1 hover:text-[#800020] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => handleNavClick('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="font-brand text-2xl sm:text-3xl font-bold tracking-[0.22em] text-[#4E0E1B] group-hover:text-[#800020] transition-colors uppercase">
                RANGMAHAL
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-7 lg:gap-9 text-sm font-medium tracking-wide text-stone-700">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`relative py-1 transition-colors hover:text-[#800020] ${
                    isActive ? 'text-[#800020] font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#800020] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Functional interactive affordances */}
          <div className="flex items-center gap-3 sm:gap-4 text-stone-700">
            {/* Search trigger */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:text-[#800020] transition-colors rounded-full hover:bg-stone-100"
              aria-label="Search Collection"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setCurrentView('shop');
              }}
              className="relative p-2 hover:text-[#800020] transition-colors rounded-full hover:bg-stone-100"
              aria-label="Wishlist"
              title={`${wishlist.length} saved pieces`}
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#800020] text-[#800020]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#800020] text-[#FAF8F5] text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:text-[#800020] transition-colors rounded-full hover:bg-stone-100"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#800020] text-[#FAF8F5] text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Admin Portal */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => setCurrentView('admin-dashboard')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#4E0E1B] text-[#FAF8F5] rounded-md hover:bg-[#671B26] transition-colors"
                title="Go to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentUser) {
                    setIsCustomerAuthModalOpen(true);
                  } else {
                    setIsAdminModalOpen(true);
                  }
                }}
                className="p-2 hover:text-[#800020] transition-colors rounded-full hover:bg-stone-100"
                aria-label="Account Login"
                title="Sign In / Admin"
              >
                <User className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible search bar */}
        {isSearchOpen && (
          <div className="border-t border-[#E8DFD4] bg-[#FDFBF7] px-4 py-3 sm:px-6">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by suit name, fabric (lawn, chiffon, khaddar), work or color..."
                className="flex-1 bg-transparent border-none text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium bg-[#800020] text-white rounded hover:bg-[#671B26] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                }}
                className="text-stone-400 hover:text-stone-600 p-1 text-xs"
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Mobile menu sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E8DFD4] bg-[#FAF8F5] px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`block w-full text-left py-2 text-base ${
                  currentView === item.view ? 'text-[#800020] font-semibold' : 'text-stone-700'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsAdminModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-stone-500 hover:text-[#800020]"
              >
                Admin Portal Login
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
