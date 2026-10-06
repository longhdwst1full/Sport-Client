'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, ShoppingBag } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'cart';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration: number;
  createdAt: number;
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
  cart: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      toast: () => {},
      success: () => {},
      error: () => {},
      info: () => {},
      warning: () => {},
      cart: () => {},
      removeToast: () => {},
    };
  }
  return context;
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const config = {
    success: {
      border: 'border-success-500/30',
      glow: 'shadow-success-950/40',
      iconBg: 'bg-success-500/15 text-success-400 ring-1 ring-success-500/30',
      icon: <CheckCircle2 className="size-5" />,
      barColor: 'bg-gradient-to-r from-success-500 to-success-400',
      badge: 'Thành công',
      badgeClass: 'bg-success-950/60 text-success-300 border-success-500/30',
    },
    // Thêm vào giỏ là kết quả tích cực: dùng xanh "thành công", không dùng đỏ thương hiệu (dễ đọc thành lỗi).
    cart: {
      border: 'border-success-500/30',
      glow: 'shadow-success-950/40',
      iconBg: 'bg-success-500/15 text-success-400 ring-1 ring-success-500/30',
      icon: <ShoppingBag className="size-5" />,
      barColor: 'bg-gradient-to-r from-success-500 to-success-400',
      badge: 'Giỏ hàng',
      badgeClass: 'bg-success-950/60 text-success-300 border-success-500/30',
    },
    error: {
      border: 'border-rose-500/30',
      glow: 'shadow-rose-950/40',
      iconBg: 'bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/30',
      icon: <AlertCircle className="size-5" />,
      barColor: 'bg-gradient-to-r from-rose-500 to-red-400',
      badge: 'Lỗi',
      badgeClass: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    },
    warning: {
      border: 'border-amber-500/30',
      glow: 'shadow-amber-950/40',
      iconBg: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
      icon: <AlertTriangle className="size-5" />,
      barColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
      badge: 'Lưu ý',
      badgeClass: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    },
    info: {
      border: 'border-sky-500/30',
      glow: 'shadow-sky-950/40',
      iconBg: 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/30',
      icon: <Info className="size-5" />,
      barColor: 'bg-gradient-to-r from-sky-500 to-blue-400',
      badge: 'Thông báo',
      badgeClass: 'bg-sky-950/60 text-sky-300 border-sky-500/30',
    },
  }[item.type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative overflow-hidden rounded-xl border bg-slate-950/95 p-4 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 ${config.border} ${config.glow}`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${config.iconBg}`}>
          {config.icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${config.badgeClass}`}
            >
              {config.badge}
            </span>
            <p className="truncate text-sm font-bold text-slate-100">{item.title}</p>
          </div>
          {item.message && (
            <p className="mt-1 text-xs leading-relaxed text-slate-300 line-clamp-3">
              {item.message}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(item.id)}
          className="-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-white"
          aria-label="Đóng thông báo"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>

      {/* Progress countdown bar */}
      {item.duration > 0 && (
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
          {/* CSS animation thay cho setInterval 20ms (tránh ~50 lần render/giây cho mỗi toast). */}
          <div
            className={`dc-toast-progress h-full origin-left ${config.barColor}`}
            style={{ animationDuration: `${item.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
}

export function GlobalToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = 'info', title, message, duration = 3800 }: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: ToastItem = {
        id,
        type,
        title,
        message,
        duration,
        createdAt: Date.now(),
      };

      setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // Keep max 5 visible

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
    (title: string, message?: string) => toast({ type: 'error', title, message, duration: 5000 }),
    [toast],
  );

  const info = useCallback(
    (title: string, message?: string) => toast({ type: 'info', title, message }),
    [toast],
  );

  const warning = useCallback(
    (title: string, message?: string) => toast({ type: 'warning', title, message, duration: 4500 }),
    [toast],
  );

  const cart = useCallback(
    (title: string, message?: string) => toast({ type: 'cart', title, message }),
    [toast],
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, cart, removeToast }}>
      {children}
      {/* Toast Overlay Container positioned at top-right for high visibility */}
      <aside
        aria-label="Thông báo hệ thống"
        className="fixed top-4 right-4 z-[99999] flex flex-col gap-2.5 max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none sm:top-6 sm:right-6"
      >
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={removeToast} />
        ))}
      </aside>
    </ToastContext.Provider>
  );
}
