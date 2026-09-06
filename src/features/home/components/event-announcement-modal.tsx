'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Gift,
  Copy,
  Check,
  Flame,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { MOCK_HOME_VOUCHERS as VOUCHERS } from '@/shared/data/mocks';

const STORAGE_KEY = 'baoan_promo_modal_dismissed_until';

export function EventAnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowToday, setDontShowToday] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Check localStorage and show modal after 1.5s
  useEffect(() => {
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY);
      if (dismissedUntil) {
        const expiry = parseInt(dismissedUntil, 10);
        if (Date.now() < expiry) {
          return; // Still suppressed
        }
      }
    } catch {
      // ignore
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (dontShowToday) {
      try {
        // Suppress for 24 hours
        const nextDay = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem(STORAGE_KEY, nextDay.toString());
      } catch {
        // ignore
      }
    }
  }, [dontShowToday]);

  // Handle ESC key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, handleClose]);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const handleScrollToDeals = () => {
    handleClose();
    const flashSaleEl = document.getElementById('flash-sale');
    if (flashSaleEl) {
      flashSaleEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Small floating gift badge to re-open modal if desired */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-2.5 text-xs font-black uppercase text-white shadow-xl shadow-amber-500/25 transition hover:scale-105 active:scale-95 animate-bounce duration-1000"
          aria-label="Mở ưu đãi tặng voucher"
        >
          <Gift className="size-4 animate-spin duration-3000" />
          <span>Voucher 500k</span>
        </button>
      )}

      {/* Main Promo Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
            onClick={handleClose}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl sm:p-8 animate-in zoom-in-95 duration-200">
            {/* Background Festive Decor */}
            <div className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 size-48 rounded-full bg-emerald-500/10 blur-3xl" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 grid size-8 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
              aria-label="Đóng thông báo"
            >
              <X className="size-4" />
            </button>

            {/* Modal Header */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200/80 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-rose-600">
                <Sparkles className="size-3.5 fill-rose-500" />
                ĐẠI TIỆC THỂ THAO BẢO AN SPORT
              </div>

              <h2 className="mt-3 text-xl font-black text-slate-900 sm:text-2xl leading-tight">
                Ưu Đãi Chào Mừng Mùa Thu <br />
                <span className="bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent">
                  Tặng Voucher Đến 500.000đ
                </span>
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                Chào mừng bạn đến với Bảo An Sport! Nhập mã giảm giá trực tiếp vào đơn hàng khi mua thiết bị tập luyện chính hãng.
              </p>
            </div>

            {/* Voucher Cards Grid */}
            <div className="mt-5 space-y-3">
              {VOUCHERS.map((v) => {
                const isCopied = copiedCode === v.code;
                return (
                  <div
                    key={v.code}
                    className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-dashed border-rose-300 bg-rose-50/50 p-3.5 transition hover:border-rose-400 hover:bg-rose-50/80"
                  >
                    {/* Left details */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-black text-rose-700 sm:text-base">
                          {v.code}
                        </span>
                        <span className="rounded bg-rose-600 px-1.5 py-0.2 text-[10px] font-black text-white">
                          - {v.discount}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] font-medium text-slate-600">
                        {v.minSpend} · {v.desc}
                      </p>
                    </div>

                    {/* Copy CTA Button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(v.code)}
                      className={`inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition shadow-sm ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Service commitments summary */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Chính hãng 100%
              </span>
              <span>•</span>
              <span>Giao lắp hỏa tốc 2h</span>
              <span>•</span>
              <span>Bảo hành 5 năm</span>
            </div>

            {/* Primary Action Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleScrollToDeals}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3 text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-emerald-600/30 transition hover:from-emerald-500 hover:to-teal-500 hover:shadow-emerald-600/40"
              >
                <Flame className="size-4 fill-white" />
                <span>Khám Phá Siêu Deal Ngay</span>
                <ArrowRight className="size-4" />
              </button>
            </div>

            {/* Checkbox "Don't show today" & Close Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <label className="flex cursor-pointer items-center gap-2 select-none hover:text-slate-800">
                <input
                  type="checkbox"
                  checked={dontShowToday}
                  onChange={(e) => setDontShowToday(e.target.checked)}
                  className="size-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Không hiển thị lại hôm nay</span>
              </label>

              <button
                type="button"
                onClick={handleClose}
                className="font-semibold text-slate-400 hover:text-slate-700"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
