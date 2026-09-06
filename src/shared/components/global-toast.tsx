'use client';

import React, { createContext, useContext, useState, useCallback, useId } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export type ToastInput = {
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
};

interface ToastContextValue {
  toast: (options: ToastInput) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    // Fallback if rendered outside provider to avoid crash
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      removeToast: () => {},
    };
  }
  return context;
}

export function GlobalToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 3500 }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast],
  );

  const success = useCallback(
    (title: string, message?: string) => toast({ type: 'success', title, message }),
    [toast],
  );

  const error = useCallback(
    (title: string, message?: string) => toast({ type: 'error', title, message }),
    [toast],
  );

  const info = useCallback(
    (title: string, message?: string) => toast({ type: 'info', title, message }),
    [toast],
  );

  const warning = useCallback(
    (title: string, message?: string) => toast({ type: 'warning', title, message }),
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, removeToast }}>
      {children}
      {/* Toast Overlay Container */}
      <aside
        aria-label="Thông báo hệ thống"
        className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0 sm:bottom-6 sm:right-6"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            role="status"
            aria-live="polite"
            className={`pointer-events-auto flex items-start gap-3 rounded-xl p-3.5 shadow-2xl backdrop-blur-md border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              item.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-950/40'
                : item.type === 'error'
                ? 'bg-slate-900/95 border-red-500/40 text-white shadow-red-950/40'
                : item.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-white shadow-amber-950/40'
                : 'bg-slate-900/95 border-blue-500/40 text-white shadow-blue-950/40'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {item.type === 'success' && (
                <CheckCircle2 className="size-5 text-emerald-400 animate-bounce" />
              )}
              {item.type === 'error' && <AlertCircle className="size-5 text-red-400" />}
              {item.type === 'warning' && <AlertTriangle className="size-5 text-amber-400" />}
              {item.type === 'info' && <Info className="size-5 text-blue-400" />}
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-100">{item.title}</p>
              {item.message && <p className="mt-0.5 text-slate-300 line-clamp-2">{item.message}</p>}
            </div>
            <button
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
              aria-label="Đóng"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </aside>
    </ToastContext.Provider>
  );
}
