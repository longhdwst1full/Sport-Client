'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { STORE_ANNOUNCEMENTS } from '@/shared/constants';
import { useAutoplayAllowed } from '@/shared/hooks';

/**
 * PERF: owns its own 4s rotation interval so the rest of the header (mega
 * menus, cart badge, auth state) does not re-render every tick.
 */
export function AnnouncementTicker() {
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  // Dừng khi cuộn khỏi màn hình, ẩn tab hoặc người dùng chọn giảm chuyển động.
  const autoplay = useAutoplayAllowed(rootRef);

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % STORE_ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [autoplay]);

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-slate-950 px-3 py-2 text-center text-[11px] font-bold uppercase tracking-[.14em] text-slate-300 sm:px-4 sm:tracking-[.16em]">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="hidden items-center gap-2 text-xs font-semibold text-emerald-400 xl:flex">
          <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Showroom mở cửa 8:30 - 21:30 cả Chủ nhật</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center h-5 overflow-hidden px-4 min-w-0">
          {STORE_ANNOUNCEMENTS.map((text, i) => (
            <span
              key={text}
              className={`absolute inset-0 flex items-center justify-center transition-all duration-500 truncate ${
                i === announcementIndex
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0 pointer-events-none'
              }`}
            >
              {text}
            </span>
          ))}
        </div>

        <div className="hidden items-center gap-4 text-xs font-semibold text-slate-400 xl:flex">
          <Link href="/contact" className="hover:text-white transition">Hệ thống Showroom</Link>
        </div>
      </div>
    </div>
  );
}
