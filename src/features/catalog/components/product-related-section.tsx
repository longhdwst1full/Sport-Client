'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Flame,
  Clock,
  ShoppingBag,
  Eye,
  ArrowRight,
  Star,
  Sparkles,
  Zap,
  Gift,
  ChevronRight,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { vndMoney } from '@/shared/format/money';
import { useAppDispatch } from '@/app/store/hooks';
import { addCartItem } from '@/app/store/cart.slice';
import { STORE_CATEGORIES, STORE_CONFIG } from '@/constants';

export interface CatalogProductSummary {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  primaryCategory?: string;
  imageUrl?: string;
  minPrice?: string | number;
  originalPrice?: number;
  shortDescription?: string;
  badge?: string;
}

// Complete catalog for related products recommendations
const ALL_CATALOG_PRODUCTS: CatalogProductSummary[] = [
  {
    id: 'prod-1',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng DCTD Pro X1',
    brand: 'Bảo An Sport',
    primaryCategory: 'Máy chạy bộ',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    minPrice: 14500000,
    originalPrice: 18900000,
    badge: 'Bán chạy nhất',
  },
  {
    id: 'prod-4',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ DCTD AirBike',
    brand: 'Bảo An Sport',
    primaryCategory: 'Xe đạp tập',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    minPrice: 6200000,
    originalPrice: 8200000,
    badge: 'Giảm 25%',
  },
  {
    id: 'prod-5',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    minPrice: 2150000,
    originalPrice: 2800000,
    badge: 'Chịu tải 400kg',
  },
  {
    id: 'prod-9',
    slug: 'gian-ta-da-nang-olympic-pro',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro (Kèm Xô Đôi)',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    minPrice: 18900000,
    originalPrice: 24500000,
    badge: 'Combo Trọn Bộ',
  },
  {
    id: 'prod-10',
    slug: 'bo-ta-tay-thao-lap-cao-cap-20kg',
    name: 'Bộ Tạ Tay Tháo Lắp Cao Cấp 20KG (Đĩa Cao Su Đúc)',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    minPrice: 1890000,
    originalPrice: 2450000,
    badge: 'Kèm thanh nối Barbell',
  },
  {
    id: 'prod-6',
    slug: 'tham-yoga-dinh-tuyen-cao-su',
    name: 'Thảm Yoga Định Tuyến Cao Su Tự Nhiên PU 5mm',
    brand: 'Bảo An Sport',
    primaryCategory: 'Yoga & Phục hồi',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    minPrice: 890000,
    originalPrice: 1200000,
    badge: 'Chống trượt Pro',
  },
  {
    id: 'prod-7',
    slug: 'ta-binh-voi-kettlebell-gang-duc',
    name: 'Tạ Bình Vôi Kettlebell Gang Đúc Bọc Neoprene 16KG',
    brand: 'Bảo An Sport',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    minPrice: 790000,
    originalPrice: 990000,
    badge: 'Tiêu chuẩn CE',
  },
  {
    id: 'prod-8',
    slug: 'sung-massage-cam-tay-phuc-hoi',
    name: 'Súng Massage Cầm Tay Trị Liệu Cơ Bắp DCTD Recovery',
    brand: 'Bảo An Sport',
    primaryCategory: 'Yoga & Phục hồi',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    minPrice: 1850000,
    originalPrice: 2500000,
    badge: 'Pin 8 giờ',
  },
];

// Curated Flash Deals for promotion under product detail
const FLASH_SALE_DEALS = [
  {
    id: 'fs-detail-1',
    slug: 'gian-ta-da-nang-olympic-pro',
    name: 'Giàn tạ đa năng 3 vị trí Olympic Pro (Kèm xô đôi & Đẩy ngực)',
    price: 18900000,
    originalPrice: 24500000,
    discount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    sold: 16,
    total: 20,
    gift: 'Tặng bộ tạ đĩa 50kg + Thảm sàn EPDM',
    badge: 'Giá sốc hôm nay',
  },
  {
    id: 'fs-detail-2',
    slug: 'bo-ta-tay-thao-lap-cao-cap-20kg',
    name: 'Bộ tạ tay tháo lắp cao cấp 20kg (2x10kg đĩa cao su đúc)',
    price: 1890000,
    originalPrice: 2450000,
    discount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    sold: 28,
    total: 30,
    gift: 'Tặng găng tay thể hình cao cấp',
    badge: 'Sắp cháy hàng',
  },
  {
    id: 'fs-detail-3',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ DCTD AirBike Bánh Đà 12kg',
    price: 6200000,
    originalPrice: 8200000,
    discount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    sold: 11,
    total: 15,
    gift: 'Tặng bình nước thể thao & Thảm lót sàn',
    badge: 'Giao nhanh 2H',
  },
  {
    id: 'fs-detail-4',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng DCTD Pro X1 Động Cơ 3.5HP',
    price: 14500000,
    originalPrice: 18900000,
    discount: 23,
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    sold: 14,
    total: 18,
    gift: 'Tặng đai massage bụng rung nhiệt',
    badge: 'Bán chạy số 1',
  },
];

interface ProductRelatedSectionProps {
  currentSlug: string;
  currentCategory?: string;
  productName?: string;
}

export function ProductRelatedSection({
  currentSlug,
  currentCategory = 'Gym & Sức mạnh',
  productName = '',
}: ProductRelatedSectionProps) {
  const dispatch = useAppDispatch();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Flash sale countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 4,
    minutes: 38,
    seconds: 25,
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

  // Filter related products: same category first, excluding current product
  const relatedProducts = useMemo(() => {
    const normCat = (currentCategory || '').toLowerCase();

    // Candidates excluding current product
    const otherProducts = ALL_CATALOG_PRODUCTS.filter(
      (p) => p.slug !== currentSlug,
    );

    // Exact or partial category matches
    const sameCat = otherProducts.filter((p) => {
      const pCat = (p.primaryCategory || '').toLowerCase();
      if (normCat.includes('gym') || normCat.includes('sức mạnh')) {
        return pCat.includes('gym') || pCat.includes('sức mạnh');
      }
      if (normCat.includes('chạy') || normCat.includes('cardio') || normCat.includes('xe đạp')) {
        return pCat.includes('chạy') || pCat.includes('xe đạp') || pCat.includes('cardio');
      }
      if (normCat.includes('yoga') || normCat.includes('phục hồi')) {
        return pCat.includes('yoga') || pCat.includes('phục hồi');
      }
      return pCat.includes(normCat) || normCat.includes(pCat);
    });

    // Fill remaining slots up to 4 if needed
    const rest = otherProducts.filter((p) => !sameCat.some((sc) => sc.id === p.id));
    return [...sameCat, ...rest].slice(0, 4);
  }, [currentSlug, currentCategory]);

  // Filter flash sale deals excluding current product
  const activeFlashDeals = useMemo(() => {
    return FLASH_SALE_DEALS.filter((d) => d.slug !== currentSlug).slice(0, 4);
  }, [currentSlug]);

  const handleAddFlashDealToCart = (deal: (typeof FLASH_SALE_DEALS)[0]) => {
    dispatch(
      addCartItem({
        productId: deal.id,
        variantId: `${deal.id}-default`,
        sku: deal.slug.toUpperCase(),
        productType: 'STANDARD',
        name: deal.name,
        price: deal.price,
        imageUrl: deal.imageUrl,
        quantity: 1,
      }),
    );
    setToastMessage(`Đã thêm "${deal.name.slice(0, 32)}..." vào giỏ hàng!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="mt-16 space-y-20 border-t border-slate-200/80 pt-16">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2 rounded-2xl bg-slate-900/95 px-5 py-3 text-sm font-bold text-white shadow-2xl backdrop-blur-md animate-fade-in border border-emerald-500/30">
          <CheckCircle2 className="size-4.5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: RELATED PRODUCTS (SẢN PHẨM CÙNG LOẠI)         */}
      {/* ======================================================== */}
      <section aria-labelledby="related-products-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
              <Sparkles className="size-3.5" /> Gợi ý cùng phân khúc
            </span>
            <h2
              id="related-products-heading"
              className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl"
            >
              Sản phẩm cùng loại & Danh mục liên quan
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Các thiết bị {currentCategory} chính hãng được khách hàng yêu thích và lựa chọn nhiều nhất
            </p>
          </div>

          <Link
            href="/category"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span>Xem tất cả sản phẩm</span>
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        {/* Related Product Cards Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {relatedProducts.map((p) => {
            const numericPrice = typeof p.minPrice === 'string' ? parseInt(p.minPrice, 10) : (p.minPrice ?? 0);
            const hasDiscount = p.originalPrice && p.originalPrice > numericPrice;
            const discountPct = hasDiscount
              ? Math.round(((p.originalPrice! - numericPrice) / p.originalPrice!) * 100)
              : 0;

            return (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl"
              >
                <Link href={`/products/${p.slug}`} className="flex w-full flex-1 flex-col">
                  {/* Product Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={p.imageUrl || 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80'}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute left-3 right-3 top-3 flex items-start justify-between gap-1.5">
                      <span className="rounded-full border border-slate-100 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                        {p.badge || 'Chính hãng'}
                      </span>
                      {hasDiscount && (
                        <span className="rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-black text-white shadow-sm">
                          -{discountPct}%
                        </span>
                      )}
                    </div>

                    {/* Quick Preview overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition duration-300 group-hover:bg-black/15">
                      <span className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-xs font-bold text-slate-900 opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:-translate-y-0.5 group-hover:opacity-100">
                        <Eye className="size-3.5" /> Xem chi tiết
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider">
                      <span className="text-emerald-700">{p.brand || STORE_CONFIG.name}</span>
                      <span className="truncate text-slate-400">{p.primaryCategory}</span>
                    </div>

                    <h3 className="mt-2 min-h-[44px] text-sm font-bold text-slate-900 leading-snug line-clamp-2 transition group-hover:text-emerald-700">
                      {p.name}
                    </h3>

                    <div className="mt-2 flex items-center gap-1.5 text-xs">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="size-3 fill-amber-400" />
                        ))}
                      </div>
                      <span className="font-bold text-slate-700">5.0</span>
                      <span className="text-[11px] text-slate-400">(90+ đánh giá)</span>
                      <span className="ml-auto rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700">
                        Trả góp 0%
                      </span>
                    </div>

                    <div className="mt-auto flex items-baseline justify-between border-t border-slate-100 pt-3">
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-400">Giá khuyến mại</span>
                        <div className="flex items-baseline gap-1.5">
                          <strong className="text-base sm:text-lg font-black text-emerald-700">
                            {vndMoney.format(numericPrice)}
                          </strong>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">
                              {vndMoney.format(p.originalPrice!)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: FLASH SALE GIỜ VÀNG (NẾU CÓ FLASH SALE)       */}
      {/* ======================================================== */}
      <section
        aria-labelledby="flash-sale-heading"
        className="relative overflow-hidden rounded-[32px] border border-rose-500/20 bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 p-6 text-white shadow-2xl sm:p-10"
      >
        {/* Glow ambient background effect */}
        <div className="pointer-events-none absolute -left-20 -top-20 size-72 rounded-full bg-rose-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-emerald-600/15 blur-[100px]" />

        <div className="relative z-10">
          {/* Header with Countdown */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-600/40 animate-pulse">
                <Flame className="size-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-rose-400 border border-rose-500/30">
                    Flash Sale Có Hạn
                  </span>
                  <span className="inline-block size-2 rounded-full bg-rose-500 animate-ping" />
                </div>
                <h2
                  id="flash-sale-heading"
                  className="mt-1 text-2xl font-black text-white sm:text-3xl"
                >
                  Giờ Vàng Giá Sốc Hôm Nay
                </h2>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-md">
              <Clock className="size-4.5 text-rose-400" />
              <span className="text-xs font-bold uppercase text-slate-300">Kết thúc trong:</span>
              <div className="flex items-center gap-1.5 font-mono text-sm font-black text-white">
                <span className="rounded-lg bg-rose-600 px-2 py-1 shadow-sm">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-rose-400">:</span>
                <span className="rounded-lg bg-rose-600 px-2 py-1 shadow-sm">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-rose-400">:</span>
                <span className="rounded-lg bg-rose-600 px-2 py-1 shadow-sm">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>

          {/* Flash Deals Cards */}
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {activeFlashDeals.map((deal) => {
              const pctSold = Math.round((deal.sold / deal.total) * 100);

              return (
                <div
                  key={deal.id}
                  className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-rose-500/50 hover:bg-white/10"
                >
                  {/* Photo with discount */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-lg">
                      -{deal.discount}%
                    </div>
                    <div className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md border border-amber-400/30">
                      {deal.badge}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <Link
                      href={`/products/${deal.slug}`}
                      className="text-sm font-bold text-white transition line-clamp-2 hover:text-rose-400"
                    >
                      {deal.name}
                    </Link>

                    {/* Free gift badge */}
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-amber-300">
                      <Gift className="size-3.5 shrink-0 text-amber-400" />
                      <span className="truncate">{deal.gift}</span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-baseline gap-2">
                      <strong className="text-lg font-black text-rose-400">
                        {vndMoney.format(deal.price)}
                      </strong>
                      <span className="text-xs text-slate-400 line-through">
                        {vndMoney.format(deal.originalPrice)}
                      </span>
                    </div>

                    {/* Stock Progress Bar */}
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-300">
                        <span>Đã bán {deal.sold}/{deal.total} suất</span>
                        <span className="text-rose-400">{pctSold}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500 transition-all duration-500"
                          style={{ width: `${pctSold}%` }}
                        />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
                      <Link
                        href={`/products/${deal.slug}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                      >
                        <Eye className="size-3.5" /> Chi tiết
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleAddFlashDealToCart(deal)}
                        className="flex items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 py-2 text-xs font-bold text-white shadow-md shadow-rose-600/30 transition hover:from-rose-500 hover:to-amber-500 active:scale-95"
                      >
                        <Zap className="size-3.5 fill-white" /> Mua ngay
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CATEGORIES DIRECTORY (LIST CATE THỂ THAO)    */}
      {/* ======================================================== */}
      <section aria-labelledby="categories-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">
              <Layers className="size-3.5 text-emerald-600" /> Danh mục thiết bị
            </span>
            <h2
              id="categories-list-heading"
              className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl"
            >
              Khám phá toàn bộ danh mục tại {STORE_CONFIG.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Đầy đủ các thiết bị từ thể dục gia đình đến phòng gym dịch vụ chuyên nghiệp
            </p>
          </div>

          <Link
            href="/category"
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:underline"
          >
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        {/* Categories Visual Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STORE_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-lg"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-black uppercase text-slate-900 shadow-sm backdrop-blur">
                  {cat.badge}
                </span>
              </div>

              <div className="mt-3 flex flex-1 flex-col">
                <h3 className="text-sm font-black text-slate-900 transition group-hover:text-emerald-700">
                  {cat.name}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                  {cat.description}
                </p>
                <div className="mt-auto pt-3 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Khám phá ngay</span>
                  <ChevronRight className="size-3 transition group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
