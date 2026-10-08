import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, LogOut, Check } from 'lucide-react';

export const CustomerAuthModal: React.FC = () => {
  const {
    isCustomerAuthModalOpen,
    setIsCustomerAuthModalOpen,
    currentUser,
    setCurrentUser,
    showToast,
  } = useStore();

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  if (!isCustomerAuthModalOpen) return null;

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password', 'error');
      return;
    }

    const customer = {
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      phone: phone.trim() || '0300-0000000',
    };

    setCurrentUser(customer);
    localStorage.setItem('rm_customer_auth', JSON.stringify(customer));
    setIsCustomerAuthModalOpen(false);
    showToast(`Welcome to RANGMAHAL, ${customer.name}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rm_customer_auth');
    setIsCustomerAuthModalOpen(false);
    showToast('Signed out successfully', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8DFD4] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#FDFBF7] border-b border-[#E8DFD4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#800020]" />
            <h3 className="font-serif-luxury text-lg font-medium text-stone-900">
              {currentUser ? 'My RANGMAHAL Account' : isRegister ? 'Create Customer Account' : 'Customer Sign In'}
            </h3>
          </div>
          <button
            onClick={() => setIsCustomerAuthModalOpen(false)}
            className="text-stone-400 hover:text-stone-800 p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentUser ? (
          <div className="p-6 space-y-5">
            <div className="p-4 bg-white rounded-lg border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-400">Name:</span>
                <span className="font-semibold text-stone-900">{currentUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Email:</span>
                <span className="font-semibold text-stone-900">{currentUser.email}</span>
              </div>
              {currentUser.phone && (
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-mono text-stone-900">{currentUser.phone}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAuth} className="p-6 space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Zahra"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.pk"
                className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
              />
            </div>

            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded font-mono focus:outline-none focus:border-[#800020]"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#800020] hover:bg-[#671B26] text-white text-xs sm:text-sm font-semibold rounded shadow transition-colors cursor-pointer"
            >
              {isRegister ? 'Register & Continue' : 'Sign In'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-xs text-[#800020] hover:underline"
              >
                {isRegister
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Register Now"}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
