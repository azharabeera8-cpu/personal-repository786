import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, ShieldCheck } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, loginAdmin } = useStore();

  const [email, setEmail] = useState('admin@rangmahal.pk');
  const [password, setPassword] = useState('rangmahal2026');

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email.trim(), password.trim());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#FAF8F5] rounded-xl shadow-2xl border border-[#E8DFD4] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 bg-[#4E0E1B] text-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C5A880]" />
            <h3 className="font-brand text-lg font-bold tracking-wider">
              RANGMAHAL ADMIN
            </h3>
          </div>
          <button
            onClick={() => setIsAdminModalOpen(false)}
            className="text-white/70 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600 font-light">
            Enter administrative credentials to manage dresses, orders, customer data, and feedback.
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Admin Email / Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-stone-300 rounded focus:outline-none focus:border-[#800020]"
            />
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-snug">
            <strong>Default Demo Credentials:</strong><br />
            Username: <code className="font-mono">admin@rangmahal.pk</code><br />
            Password: <code className="font-mono">rangmahal2026</code>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#800020] hover:bg-[#671B26] text-white text-xs sm:text-sm font-semibold rounded shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Sign In to Admin Console</span>
          </button>
        </form>

      </div>
    </div>
  );
};
