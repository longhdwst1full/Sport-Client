'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Flame,
  Clock,
  Zap,
  ShoppingBag,
  Eye,
  Gift,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Star,
} from 'lucide-react';
import { StorefrontLayout } from '@/layouts/storefront-layout';
import { vndMoney } from '@/shared/format/money';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { STORE_CONFIG } from '@/constants';

interface FlashProduct {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryGroup: 'cardio' | 'gym' | 'sports' | 'accessories';
  imageUrl: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  soldCount: number;
  totalQuota: number;
  gift: string;
  specs: string;
  badge: string;
}

const FLASH_PRODUCTS: FlashProduct[] = [
  {
    id: 'fs-1',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
    category: 'Xe đạp tập',
    categoryGroup: 'cardio',
    imageUrl: '/images/products/spin-bike.jpg',
    price: 6200000,
    originalPrice: 8200000,
    discountPct: 24,
    soldCount: 16,
    totalQuota: 20,
    gift: 'Tặng thảm lót chống ồn + Bình nước thể thao',
    specs: 'Bánh đà 12kg · Kháng từ êm <25dB',
    badge: 'Cháy hàng 80%',
  },
  {
    id: 'fs-2',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP',
    category: 'Máy chạy bộ',
    categoryGroup: 'cardio',
    imageUrl: '/images/products/treadmill.jpg',
    price: 14500000,
    originalPrice: 18900000,
    discountPct: 23,
    soldCount: 18,
    totalQuota: 20,
    gift: 'Tặng cân điện tử thông minh + Đai massage bụng',
    specs: 'Động cơ 3.5HP · Nâng dốc tự động 15%',
    badge: 'Chỉ còn 2 suất',
  },
  {
    id: 'fs-bb-1',
    slug: 'vot-bong-ban-stiga-crystal-4-sao',
    name: 'Vợt Bóng Bàn Stiga Crystal 4 Sao Cao Cấp Chuẩn ITTF',
    category: 'Bóng bàn',
    categoryGroup: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1609710228159-0fa9bd7c0827?auto=format&fit=crop&w=800&q=80',
    price: 950000,
    originalPrice: 1350000,
    discountPct: 30,
    soldCount: 22,
    totalQuota: 25,
    gift: 'Tặng bao vợt cao cấp + Hộp 6 bóng thi đấu',
    specs: 'Cốt vợt 5 lớp gỗ Thuỵ Điển · Mút Stiga 2.0mm',
    badge: 'Giảm 30%',
  },
  {
    id: 'fs-bb-2',
    slug: 'ban-bong-ban-double-fish-df-201c',
    name: 'Bàn Bóng Bàn Song Ngư Double Fish DF 201C Thi Đấu',
    category: 'Bóng bàn',
    categoryGroup: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=800&q=80',
    price: 9800000,
    originalPrice: 12500000,
    discountPct: 22,
    soldCount: 5,
    totalQuota: 8,
    gift: 'Tặng bộ cọc lưới thi đấu + 2 cây vợt Double Fish',
    specs: 'Mặt bàn MDF dày 18mm · Khung thép sơn tĩnh điện',
    badge: 'Miễn phí giao lắp',
  },
  {
    id: 'fs-br-1',
    slug: 'tru-bong-ro-s206',
    name: 'Trụ Bóng Rổ Di Động Vành Lò Xo Chuyên Nghiệp S206',
    category: 'Bóng rổ',
    categoryGroup: 'sports',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    price: 7900000,
    originalPrice: 9900000,
    discountPct: 20,
    soldCount: 6,
    totalQuota: 10,
    gift: 'Tặng bóng rổ da thi đấu số 7 + Lưới dự phòng',
    specs: 'Chiều cao điều chỉnh 2.3m - 3.05m · Bảng Acrylic',
    badge: 'Hot thể thao trường học',
  },
  {
    id: 'fs-3',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro (15 Cặp Trong 1)',
    category: 'Gym & Sức mạnh',
    categoryGroup: 'gym',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    price: 3850000,
    originalPrice: 4800000,
    discountPct: 20,
    soldCount: 27,
    totalQuota: 30,
    gift: 'Tặng đôi găng tay nâng tạ Bảo An Grip',
    specs: 'Thay thế 15 cặp tạ · Thép carbon nguyên khối',
    badge: 'Hot nhất hôm nay',
  },
  {
    id: 'fs-4',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ Chịu Tải 400kg',
    category: 'Gym & Sức mạnh',
    categoryGroup: 'gym',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    price: 2150000,
    originalPrice: 2800000,
    discountPct: 23,
    soldCount: 14,
    totalQuota: 18,
    gift: 'Tặng đai bảo hộ cổ tay thể hình',
    specs: 'Đệm da PU cao cấp · 7 nấc góc nghiêng',
    badge: 'Giá sốc trong tuần',
  },
  {
    id: 'fs-5',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer',
    category: 'Xe đạp tập',
    categoryGroup: 'cardio',
    imageUrl: '/images/products/elliptical.jpg',
    price: 8900000,
    originalPrice: 11500000,
    discountPct: 23,
    soldCount: 11,
    totalQuota: 15,
    gift: 'Tặng dầu tra bảo dưỡng định kỳ 1 năm',
    specs: 'Chuyển động tự nhiên · Đo nhịp tim tay cầm',
    badge: 'Bảo vệ khớp gối',
  },
  {
    id: 'fs-6',
    slug: 'gian-ta-da-nang-olympic-pro',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro Kèm Xô Đôi',
    category: 'Gym & Sức mạnh',
    categoryGroup: 'gym',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    price: 18900000,
    originalPrice: 24500000,
    discountPct: 23,
    soldCount: 7,
    totalQuota: 10,
    gift: 'Tặng thanh kéo xô dài + Dây kéo đôi Tricep',
    specs: 'Thép hộp 50x100mm · Tải trọng 500kg',
    badge: 'Giảm 5.6 Triệu',
  },
];

import { useToast } from '@/shared/components/global-toast';

export default function FlashSalePage() {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [activeSlot, setActiveSlot] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<'all' | 'cardio' | 'gym' | 'sports'>('all');

  // Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 3,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'cardio') {
      return FLASH_PRODUCTS.filter((p) => p.categoryGroup === 'cardio');
    }
    if (activeCategory === 'gym') {
      return FLASH_PRODUCTS.filter((p) => p.categoryGroup === 'gym');
    }
    if (activeCategory === 'sports') {
      return FLASH_PRODUCTS.filter((p) => p.categoryGroup === 'sports');
    }
    return FLASH_PRODUCTS;
  }, [activeCategory]);

  const handleAddToCart = (product: FlashProduct) => {
    dispatch(
      addCartItem({
        productId: product.id,
        variantId: `${product.id}-default`,
        sku: product.slug.toUpperCase(),
        productType: 'STANDARD',
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
      }),
    );
    toast({
      type: 'success',
      title: 'Đã thêm vào giỏ hàng!',
      message: `${product.name} (Tặng: ${product.gift})`,
    });
  };

  return (
    <StorefrontLayout>
      {/* Hero Banner with Burning Glow */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-rose-600/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-amber-500/15 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-rose-400 backdrop-blur-md animate-pulse">
              <Flame className="size-4 text-rose-500 fill-rose-500" />
              <span>Sự kiện Giờ Vàng Flash Sale {STORE_CONFIG.name}</span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Giờ Vàng Giá Sốc — Giảm Tới{' '}
              <span className="bg-gradient-to-r from-amber-400 via-rose-400 to-rose-500 bg-clip-text text-transparent">
                45%
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-base">
              Hàng trăm thiết bị thể thao, máy chạy bộ, xe đạp tập và giàn tạ chính hãng trợ giá đặc biệt.
              Số lượng có hạn, áp dụng thanh toán COD hoặc chuyển khoản VietQR.
            </p>

            {/* Big Countdown Clock */}
            <div className="mt-8 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-6 py-3.5 backdrop-blur-md shadow-2xl">
              <Clock className="size-5 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Phiên kết thúc trong:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-base font-black text-white sm:text-xl">
                <span className="rounded-xl bg-rose-600 px-3 py-1.5 shadow-md">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-rose-400">:</span>
                <span className="rounded-xl bg-rose-600 px-3 py-1.5 shadow-md">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-rose-400">:</span>
                <span className="rounded-xl bg-rose-600 px-3 py-1.5 shadow-md">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Time Slot Tabs */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { slot: '09:00 - 12:00', label: 'Đang diễn ra', active: true },
              { slot: '12:00 - 17:00', label: 'Sắp bắt đầu', active: false },
              { slot: '17:00 - 21:00', label: 'Sắp bắt đầu', active: false },
              { slot: '21:00 - 24:00', label: 'Phiên đêm muộn', active: false },
            ].map((slot, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlot(idx)}
                className={`rounded-2xl border p-4 text-center transition ${
                  activeSlot === idx
                    ? 'border-rose-500 bg-rose-600/30 text-white ring-2 ring-rose-500/50'
                    : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                }`}
              >
                <strong className="block font-mono text-base font-black text-white">
                  {slot.slot}
                </strong>
                <span
                  className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${
                    activeSlot === idx
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {slot.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Flash Sale Products Section */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Phân loại sản phẩm:</span>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tất cả flash deals
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('cardio')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === 'cardio'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Máy chạy bộ & Xe đạp tập
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('gym')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === 'gym'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Gym & Thể hình
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('sports')}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                activeCategory === 'sports'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              Bóng bàn & Bóng rổ
            </button>
          </div>

          <span className="text-xs font-bold text-slate-500">
            Hiển thị {filteredProducts.length} sản phẩm ưu đãi
          </span>
        </div>

        {/* Product Cards Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((p) => {
            const pctClaimed = Math.round((p.soldCount / p.totalQuota) * 100);

            return (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-[28px] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/50 hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 p-4">
                  <Link href={`/products/${p.slug}`} className="relative block size-full">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white shadow-md shadow-rose-600/30">
                    -{p.discountPct}%
                  </div>
                  <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-amber-400/40 bg-amber-50/90 px-2.5 py-1 text-[10px] font-black text-amber-900 shadow-sm backdrop-blur">
                    {p.badge}
                  </div>
                </div>

                {/* Card Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="uppercase tracking-wider text-rose-600">{p.category}</span>
                    <span className="text-slate-400">{p.specs}</span>
                  </div>

                  <h3 className="mt-2 min-h-[44px] text-sm font-bold leading-snug text-slate-900 transition line-clamp-2 group-hover:text-rose-600">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </h3>

                  {/* Free gift */}
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50/80 p-2 text-[11px] text-amber-900">
                    <Gift className="size-3.5 shrink-0 text-amber-600" />
                    <span className="truncate font-semibold">{p.gift}</span>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <strong className="text-xl font-black text-rose-600">
                      {vndMoney.format(p.price)}
                    </strong>
                    <span className="text-xs text-slate-400 line-through">
                      {vndMoney.format(p.originalPrice)}
                    </span>
                  </div>

                  {/* Progress Quota Bar */}
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-600">
                        Đã bán {p.soldCount}/{p.totalQuota} suất
                      </span>
                      <span className="text-rose-600">{pctClaimed}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-rose-600 transition-all duration-500"
                        style={{ width: `${pctClaimed}%` }}
                      />
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Eye className="size-3.5" />
                      <span>Xem chi tiết</span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(p)}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2.5 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition hover:from-rose-500 hover:to-amber-500 active:scale-95"
                    >
                      <Zap className="size-3.5 fill-white" />
                      <span>Săn deal ngay</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Benefits Strip */}
        <div className="mt-16 grid gap-6 rounded-[32px] border border-slate-200/80 bg-slate-50 p-6 sm:grid-cols-4 sm:p-8">
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm font-bold text-slate-900">100% Chính hãng</strong>
              <p className="text-xs text-slate-500">Bảo hành 5-6 năm tận nơi</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Truck className="size-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm font-bold text-slate-900">Giao hàng hỏa tốc 2H</strong>
              <p className="text-xs text-slate-500">Showroom HN & HCM sẵn hàng</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <RotateCcw className="size-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm font-bold text-slate-900">Đổi trả 15 ngày</strong>
              <p className="text-xs text-slate-500">Lỗi kỹ thuật đổi máy mới 1-1</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Sparkles className="size-6 text-emerald-600 shrink-0" />
            <div>
              <strong className="text-sm font-bold text-slate-900">Trả góp 0% lãi suất</strong>
              <p className="text-xs text-slate-500">Thủ tục duyệt online trong 5 phút</p>
            </div>
          </div>
        </div>
      </main>
    </StorefrontLayout>
  );
}
