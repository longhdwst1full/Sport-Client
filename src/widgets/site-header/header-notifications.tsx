'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Package, Tag, Sparkles, Check, ChevronRight } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promo' | 'system';
  unread: boolean;
  link: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Đơn hàng #BA-89214 đã được đóng gói',
    message: 'Kiện hàng Bàn bóng bàn Song Ngư DF 201C đang được bàn giao cho đối tác vận chuyển hỏa tốc.',
    time: '10 phút trước',
    type: 'order',
    unread: true,
    link: '/profile?tab=orders',
  },
  {
    id: 'n-2',
    title: 'Mã giảm giá độc quyền: BAOAN500',
    message: 'Tặng bạn voucher 500.000đ cho đơn hàng thiết bị tập gym, giàn tạ từ 5 triệu. Hạn dùng 24h.',
    time: '1 giờ trước',
    type: 'promo',
    unread: true,
    link: '/checkout',
  },
  {
    id: 'n-3',
    title: 'Flash Sale thể thao ca 18:00 chuẩn bị mở',
    message: 'Hơn 50 dụng cụ bóng bàn, boxing, tạ tay giảm sốc đến 45%. Hãy đặt lịch săn sale ngay!',
    time: '3 giờ trước',
    type: 'promo',
    unread: true,
    link: '/flash-sale',
  },
  {
    id: 'n-4',
    title: 'Chào mừng bạn đến với Bảo An Sport',
    message: 'Hoàn thiện hồ sơ hội viên để nhận 100 điểm thưởng tích lũy và voucher miễn phí vận chuyển.',
    time: 'Hôm qua',
    type: 'system',
    unread: false,
    link: '/profile',
  },
];

export function HeaderNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'order' | 'promo'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'all') return true;
    return item.type === activeTab;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative grid size-10 place-items-center rounded-full border border-slate-200/80 bg-slate-50 text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
        aria-label={`Thông báo, ${unreadCount} tin chưa đọc`}
        aria-expanded={isOpen}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 grid min-w-5 h-5 place-items-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/70">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">Thông Báo</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Check className="size-3.5" />
                Đã đọc tất cả
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 px-3 pt-2 text-xs font-semibold text-slate-600 gap-1 bg-white">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                activeTab === 'all'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('order')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                activeTab === 'order'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Đơn hàng
            </button>
            <button
              onClick={() => setActiveTab('promo')}
              className={`pb-2 px-2.5 border-b-2 transition-all ${
                activeTab === 'promo'
                  ? 'border-emerald-600 text-emerald-700 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              Khuyến mãi
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Không có thông báo nào trong mục này
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => {
                    markItemAsRead(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 p-3.5 transition hover:bg-slate-50 block ${
                    item.unread ? 'bg-emerald-50/40' : 'bg-white'
                  }`}
                >
                  {/* Icon */}
                  <div className="shrink-0 mt-0.5">
                    {item.type === 'order' && (
                      <div className="flex size-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <Package className="size-4" />
                      </div>
                    )}
                    {item.type === 'promo' && (
                      <div className="flex size-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                        <Tag className="size-4" />
                      </div>
                    )}
                    {item.type === 'system' && (
                      <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                        <Sparkles className="size-4" />
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-xs truncate ${item.unread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {item.title}
                      </p>
                      {item.unread && (
                        <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-400">{item.time}</p>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 p-2 text-center">
            <Link
              href="/profile?tab=orders"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition"
            >
              Xem tất cả đơn hàng & ưu đãi
              <ChevronRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
