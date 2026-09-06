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
  ShieldCheck,
  Truck,
  Check,
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
  categoryGroup: 'cardio' | 'gym' | 'combo' | 'table_tennis' | 'martial_arts';
  primaryCategory: string;
  imageUrl: string;
  minPrice: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  badge?: string;
  specs: string[];
  installmentMonthly: number;
}

// Curated high-quality catalog products with studio photography and precise specifications
const ALL_CATALOG_PRODUCTS: CatalogProductSummary[] = [
  {
    id: 'prod-bike-1',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Pro',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: '/images/products/spin-bike.jpg',
    minPrice: 6200000,
    originalPrice: 8200000,
    rating: 5.0,
    reviewCount: 96,
    soldCount: 148,
    badge: 'Bán chạy nhất',
    specs: ['Bánh đà 12kg', 'Kháng từ êm ái <25dB', 'Bảo hành 5 năm'],
    installmentMonthly: 516000,
  },
  {
    id: 'prod-bike-2',
    slug: 'xe-dap-tap-the-thao-spinning-speed7',
    name: 'Xe Đạp Tập Thể Thao Spinning Bike Speed-7 Vô Cấp',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: '/images/products/spin-bike.jpg',
    minPrice: 7850000,
    originalPrice: 9900000,
    rating: 4.9,
    reviewCount: 64,
    soldCount: 89,
    badge: 'Kết nối Kinomap',
    specs: ['Bánh đà thép đúc 16kg', 'Khung chữ V chịu lực 160kg', 'Kháng lực vô cấp'],
    installmentMonthly: 654000,
  },
  {
    id: 'prod-treadmill-1',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Máy chạy bộ',
    imageUrl: '/images/products/treadmill.jpg',
    minPrice: 14500000,
    originalPrice: 18900000,
    rating: 5.0,
    reviewCount: 118,
    soldCount: 210,
    badge: 'Nâng dốc tự động',
    specs: ['Motor 3.5HP biến tần', 'Thảm Diamond 7 lớp 140x52cm', 'Gập thủy lực'],
    installmentMonthly: 1208000,
  },
  {
    id: 'prod-elliptical-1',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer',
    brand: 'Bảo An Sport',
    categoryGroup: 'cardio',
    primaryCategory: 'Xe đạp tập',
    imageUrl: '/images/products/elliptical.jpg',
    minPrice: 8900000,
    originalPrice: 11500000,
    rating: 4.9,
    reviewCount: 52,
    soldCount: 75,
    badge: 'Bảo vệ khớp gối',
    specs: ['Kháng lực từ 16 cấp', 'Chuyển động tự nhiên', 'Đo nhịp tim tay cầm'],
    installmentMonthly: 741000,
  },
  {
    id: 'prod-gym-1',
    slug: 'gian-ta-da-nang-olympic-pro',
    name: 'Giàn Tạ Đa Năng 3 Vị Trí Olympic Pro Kèm Xô Đôi',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    minPrice: 18900000,
    originalPrice: 24500000,
    rating: 5.0,
    reviewCount: 82,
    soldCount: 94,
    badge: 'Đầy đủ bài tập',
    specs: ['Thép hộp 50x100mm dày 2.5mm', 'Xô đôi + Ép ngực + Đạp đùi', 'Tải trọng 500kg'],
    installmentMonthly: 1575000,
  },
  {
    id: 'prod-gym-2',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro (15 Cặp Trong 1)',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    minPrice: 3850000,
    originalPrice: 4800000,
    rating: 4.9,
    reviewCount: 142,
    soldCount: 320,
    badge: 'Thay thế 15 cặp tạ',
    specs: ['Chuyển nấc xoay 1 giây', 'Dải tạ 2.5kg - 24kg', 'Đế khay chống va đập'],
    installmentMonthly: 320000,
  },
  {
    id: 'prod-gym-3',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ Chịu Tải 400kg',
    brand: 'Bảo An Sport',
    categoryGroup: 'gym',
    primaryCategory: 'Gym & Sức mạnh',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    minPrice: 2150000,
    originalPrice: 2800000,
    rating: 4.8,
    reviewCount: 95,
    soldCount: 230,
    badge: 'Gập gọn thông minh',
    specs: ['Đệm da PU êm chống trượt', '7 nấc góc nghiêng & dốc âm', 'Khung thép tam giác'],
    installmentMonthly: 179000,
  },
  {
    id: 'prod-combo-1',
    slug: 'combo-home-gym-smith-machine',
    name: 'Combo Home Gym Trọn Bộ Smith Machine + Ghế + 100kg Đĩa Tạ',
    brand: 'Bảo An Sport',
    categoryGroup: 'combo',
    primaryCategory: 'Combo Home Gym',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    minPrice: 28900000,
    originalPrice: 36000000,
    rating: 5.0,
    reviewCount: 45,
    soldCount: 68,
    badge: 'Tiết kiệm 7.1 triệu',
    specs: ['Ray trượt tuyến tính siêu êm', 'Tặng thảm cao su EPDM', 'Bảo hành khung 10 năm'],
    installmentMonthly: 2408000,
  },
];

// Curated Flash Deals for promotion under product detail
const FLASH_SALE_DEALS = [
  {
    id: 'fs-detail-bike',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ Bảo An AirBike Bánh Đà 12kg',
    price: 6200000,
    originalPrice: 8200000,
    discount: 24,
    imageUrl: '/images/products/spin-bike.jpg',
    sold: 14,
    total: 18,
    gift: 'Tặng thảm lót chống ồn + Bình nước thể thao',
    badge: 'Giảm sốc 24%',
    specs: 'Bánh đà 12kg · Kháng từ êm ái',
  },
  {
    id: 'fs-detail-treadmill',
    slug: 'may-chay-bo-dctd-pro-x1',
    name: 'Máy Chạy Bộ Điện Đa Năng Bảo An Pro X1 Động Cơ 3.5HP Nâng Dốc',
    price: 14500000,
    originalPrice: 18900000,
    discount: 23,
    imageUrl: '/images/products/treadmill.jpg',
    sold: 17,
    total: 20,
    gift: 'Tặng cân điện tử thông minh + Đai massage',
    badge: 'Giao nhanh 2H',
    specs: 'Động cơ 3.5HP · Nâng dốc 15%',
  },
  {
    id: 'fs-detail-elliptical',
    slug: 'may-truot-tuyet-toan-than-elliptical-orbit',
    name: 'Xe Đạp Trượt Tuyết Toàn Thân Elliptical Cross-Trainer Bảo An Sport',
    price: 8900000,
    originalPrice: 11500000,
    discount: 23,
    imageUrl: '/images/products/elliptical.jpg',
    sold: 9,
    total: 15,
    gift: 'Tặng găng tay thể thao + Dầu tra bảo dưỡng',
    badge: 'Sắp cháy hàng',
    specs: 'Kháng lực từ 16 nấc · Êm khớp gối',
  },
  {
    id: 'fs-detail-weights',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro Kèm Khay Chống Va',
    price: 3850000,
    originalPrice: 4800000,
    discount: 20,
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    sold: 26,
    total: 30,
    gift: 'Tặng đôi găng tay nâng tạ Pro Grip',
    badge: 'Giá độc quyền',
    specs: 'Thay thế 15 cặp tạ · Thép carbon',
  },
];

interface ProductRelatedSectionProps {
  currentSlug: string;
  currentCategory?: string;
  productName?: string;
}

export function ProductRelatedSection({
  currentSlug,
  currentCategory = 'Xe đạp tập',
}: ProductRelatedSectionProps) {
  const dispatch = useAppDispatch();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active filter tab: 'all' | 'cardio' | 'gym' | 'combo'
  const [activeTab, setActiveTab] = useState<'all' | 'cardio' | 'gym' | 'combo'>('all');

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

  // Filter products by tab and exclude current product
  const displayedProducts = useMemo(() => {
    // Candidates excluding current product
    const otherProducts = ALL_CATALOG_PRODUCTS.filter((p) => p.slug !== currentSlug);

    if (activeTab === 'cardio') {
      return otherProducts.filter((p) => p.categoryGroup === 'cardio');
    }
    if (activeTab === 'gym') {
      return otherProducts.filter((p) => p.categoryGroup === 'gym');
    }
    if (activeTab === 'combo') {
      return otherProducts.filter((p) => p.categoryGroup === 'combo');
    }

    // Default 'all': Prioritize products from same category or group first
    const isCurrentCardio =
      currentCategory.toLowerCase().includes('xe đạp') ||
      currentCategory.toLowerCase().includes('chạy') ||
      currentCategory.toLowerCase().includes('máy tập');

    const sorted = [...otherProducts].sort((a, b) => {
      if (isCurrentCardio) {
        if (a.categoryGroup === 'cardio' && b.categoryGroup !== 'cardio') return -1;
        if (b.categoryGroup === 'cardio' && a.categoryGroup !== 'cardio') return 1;
      } else {
        if (a.categoryGroup === 'gym' && b.categoryGroup !== 'gym') return -1;
        if (b.categoryGroup === 'gym' && a.categoryGroup !== 'gym') return 1;
      }
      return 0;
    });

    return sorted.slice(0, 4);
  }, [currentSlug, activeTab, currentCategory]);

  // Filter flash sale deals excluding current product
  const activeFlashDeals = useMemo(() => {
    return FLASH_SALE_DEALS.filter((d) => d.slug !== currentSlug).slice(0, 4);
  }, [currentSlug]);

  const handleAddToCart = (product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    imageUrl: string;
  }) => {
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
    setToastMessage(`Đã thêm "${product.name.slice(0, 35)}..." vào giỏ hàng!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="mt-16 space-y-20 border-t border-slate-200/80 pt-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-500/40 bg-slate-900/95 px-6 py-3.5 text-sm font-bold text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
          <span>{toastMessage}</span>
          <Link
            href="/cart"
            className="ml-2 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-black uppercase text-white hover:bg-emerald-500"
          >
            Xem giỏ hàng
          </Link>
        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 1: RELATED PRODUCTS (SẢN PHẨM CÙNG LOẠI CHỈNH CHU) */}
      {/* ======================================================== */}
      <section aria-labelledby="related-products-heading">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-800">
                <Sparkles className="size-3.5 text-emerald-700" /> Gợi ý cùng phân khúc
              </span>
              <span className="hidden items-center gap-1 text-xs font-bold text-slate-500 sm:inline-flex">
                <ShieldCheck className="size-3.5 text-emerald-600" /> Cam kết chính hãng 100%
              </span>
            </div>
            <h2
              id="related-products-heading"
              className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl"
            >
              Sản phẩm cùng loại & Danh mục liên quan
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Các thiết bị {currentCategory} chính hãng được khách hàng yêu thích và lựa chọn nhiều nhất tại Bảo An Sport
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1.5 backdrop-blur-sm scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === 'all'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả gợi ý
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('cardio')}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === 'cardio'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Xe đạp & Máy chạy bộ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gym')}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === 'gym'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Gym & Thể hình
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('combo')}
              className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                activeTab === 'combo'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combo Home Gym
            </button>
          </div>
        </div>

        {/* Product Cards Grid with E-commerce Polish */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayedProducts.map((p) => {
            const hasDiscount = p.originalPrice > p.minPrice;
            const discountPct = hasDiscount
              ? Math.round(((p.originalPrice - p.minPrice) / p.originalPrice) * 100)
              : 0;

            return (
              <article
                key={p.id}
                className="group relative flex flex-col overflow-hidden rounded-[24px] border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-xl"
              >
                {/* Product Thumbnail with Studio Background */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100/70 p-4">
                  <Link
                    href={`/products/${p.slug}`}
                    className="relative block size-full"
                    aria-label={p.name}
                  >
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>

                  {/* Top Badges */}
                  <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                    <span className="rounded-full border border-slate-200/80 bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-sm backdrop-blur">
                      {p.badge || 'Chính hãng'}
                    </span>
                    {hasDiscount && (
                      <span className="rounded-full bg-rose-600 px-2.5 py-1 text-[11px] font-black text-white shadow-md shadow-rose-600/30">
                        -{discountPct}%
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay on Image Hover */}
                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Link
                      href={`/products/${p.slug}`}
                      className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-white/95 py-2 text-xs font-bold text-slate-800 shadow-md backdrop-blur transition hover:bg-emerald-600 hover:text-white"
                    >
                      <Eye className="size-3.5" /> Chi tiết
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price: p.minPrice,
                          imageUrl: p.imageUrl,
                        })
                      }
                      className="grid size-9 place-items-center rounded-xl bg-emerald-600 text-white shadow-md transition hover:bg-emerald-500 active:scale-95"
                      aria-label="Thêm vào giỏ"
                    >
                      <ShoppingBag className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  {/* Category & Stock Status */}
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="uppercase tracking-wider text-emerald-700">
                      {p.primaryCategory}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-500">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Còn hàng · Giao 2H
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-2 min-h-[44px] text-sm font-bold leading-snug text-slate-900 transition line-clamp-2 group-hover:text-emerald-700">
                    <Link href={`/products/${p.slug}`}>{p.name}</Link>
                  </h3>

                  {/* Key Specifications Tag Pills */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {p.specs.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Rating & Social Proof */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="size-3 fill-amber-400" />
                      ))}
                    </div>
                    <span className="font-extrabold text-slate-800">{p.rating.toFixed(1)}</span>
                    <span className="text-[11px] text-slate-400">({p.reviewCount})</span>
                    <span className="ml-auto text-[11px] font-semibold text-slate-400">
                      Đã bán {p.soldCount}+
                    </span>
                  </div>

                  {/* Price & Installment Tag */}
                  <div className="mt-auto border-t border-slate-100 pt-3">
                    <div className="flex items-baseline justify-between gap-1">
                      <div>
                        <span className="block text-[10px] font-semibold text-slate-400">
                          Giá ưu đãi chính hãng
                        </span>
                        <div className="flex items-baseline gap-2">
                          <strong className="text-base font-black text-emerald-700 sm:text-lg">
                            {vndMoney.format(p.minPrice)}
                          </strong>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through">
                              {vndMoney.format(p.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Installment Badge */}
                    <div className="mt-2 flex items-center justify-between rounded-lg bg-emerald-50/70 px-2.5 py-1 text-[11px]">
                      <span className="font-bold text-emerald-800">Trả góp 0% lãi suất:</span>
                      <strong className="font-black text-emerald-700">
                        Chỉ ~{vndMoney.format(p.installmentMonthly)}/tháng
                      </strong>
                    </div>

                    {/* Action Button at Card Footer */}
                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart({
                          id: p.id,
                          slug: p.slug,
                          name: p.name,
                          price: p.minPrice,
                          imageUrl: p.imageUrl,
                        })
                      }
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600 active:scale-[0.98]"
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>Thêm vào giỏ hàng</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: FLASH SALE GIỜ VÀNG GIÁ SỐC                   */}
      {/* ======================================================== */}
      <section
        aria-labelledby="flash-sale-heading"
        className="relative overflow-hidden rounded-[32px] border border-rose-500/20 bg-gradient-to-br from-rose-950 via-slate-950 to-slate-900 p-6 text-white shadow-2xl sm:p-10"
      >
        {/* Ambient glow backgrounds */}
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
                  <span className="rounded-full border border-rose-500/30 bg-rose-500/20 px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-rose-400">
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
                  {/* Studio image with discount */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-900/60 p-3">
                    <Image
                      src={deal.imageUrl}
                      alt={deal.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain p-2 transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-black text-white shadow-lg">
                      -{deal.discount}%
                    </div>
                    <div className="absolute right-3 top-3 rounded-full border border-amber-400/30 bg-black/60 px-2.5 py-1 text-[10px] font-bold text-amber-300 backdrop-blur-md">
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
                    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
                      <Link
                        href={`/products/${deal.slug}`}
                        className="flex items-center justify-center gap-1 rounded-xl border border-white/20 bg-white/5 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                      >
                        <Eye className="size-3.5" /> Chi tiết
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          handleAddToCart({
                            id: deal.id,
                            slug: deal.slug,
                            name: deal.name,
                            price: deal.price,
                            imageUrl: deal.imageUrl,
                          })
                        }
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
      {/* SECTION 3: CATEGORIES DIRECTORY (DANH MỤC LIÊN QUAN)    */}
      {/* ======================================================== */}
      <section aria-labelledby="categories-list-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-slate-800">
              <Layers className="size-3.5 text-emerald-600" /> Hệ sinh thái thể thao
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
                <div className="mt-auto flex items-center gap-1 pt-3 text-[11px] font-bold text-emerald-700">
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
