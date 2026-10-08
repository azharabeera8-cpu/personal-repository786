import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />,
    info: <Info className="w-4 h-4 text-amber-700 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 bg-[#FDFBF7] text-stone-900',
    error: 'border-rose-200 bg-[#FDFBF7] text-stone-900',
    info: 'border-amber-200 bg-[#FDFBF7] text-stone-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm pointer-events-none transition-all duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-md shadow-lg border text-sm font-medium ${borderStyles[toast.type]}`}
      >
        {icons[toast.type]}
        <span className="leading-snug">{toast.text}</span>
      </div>
    </div>
  );
};
