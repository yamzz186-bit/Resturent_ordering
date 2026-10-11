import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRestaurant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2.5">
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />;
            case 'warning':
              return <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />;
            case 'error':
              return <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />;
            default:
              return <Info className="h-5 w-5 text-stone-600 shrink-0 mt-0.5" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 rounded-lg border border-stone-200 bg-white p-3.5 shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200"
          >
            {getIcon()}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-stone-900">{toast.title}</p>
              <p className="mt-0.5 text-xs text-stone-600 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-stone-600 p-0.5"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
