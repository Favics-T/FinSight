import React from 'react';
import { useToastStore } from '../../store/toast-store';

const variantClass = {
  info: 'border-blue-400/50',
  success: 'border-emerald-400/50',
  error: 'border-red-400/50',
};

export function ToastViewport() {
  const { toasts, dismissToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex w-[320px] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`glass border rounded-lg p-3 shadow-lg ${variantClass[toast.variant] || variantClass.info}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">{toast.title}</p>
              {toast.description ? <p className="text-xs text-muted mt-1">{toast.description}</p> : null}
            </div>
            <button onClick={() => dismissToast(toast.id)} className="text-xs text-muted hover:text-white">
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
