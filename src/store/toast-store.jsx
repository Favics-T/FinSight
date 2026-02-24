import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastStore = createContext(null);

let seed = 0;

export function ToastStoreProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const pushToast = useCallback((payload) => {
    const id = ++seed;
    const toast = {
      id,
      title: payload.title || 'Notification',
      description: payload.description || '',
      variant: payload.variant || 'info',
    };

    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => dismissToast(id), payload.duration ?? 3500);
  }, [dismissToast]);

  const value = useMemo(() => ({ toasts, pushToast, dismissToast }), [toasts, pushToast, dismissToast]);

  return <ToastStore.Provider value={value}>{children}</ToastStore.Provider>;
}

export function useToastStore() {
  const ctx = useContext(ToastStore);
  if (!ctx) throw new Error('useToastStore must be used within ToastStoreProvider');
  return ctx;
}
