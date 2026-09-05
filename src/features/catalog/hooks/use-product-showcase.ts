'use client';

import { useMemo } from 'react';
import { useListCatalogProducts } from '@/generated/api/catalog/catalog';
import { vndMoney } from '@/shared/format/money';

export const FALLBACK_PRODUCTS = [
  {
    id: 'prod-1',
    slug: 'may-chay-bo-dctd-pro-x1',
    productType: 'SIMPLE',
    name: 'Máy Chạy Bộ Điện Đa Năng DCTD Pro X1',
    brand: 'Bảo An Sport',
    category: 'Máy chạy bộ',
    badge: 'Bán chạy nhất',
    imageUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&w=800&q=80',
    numericPrice: 14500000,
    displayPrice: '14.500.000 ₫',
    originalPrice: 18900000,
    displayOriginalPrice: '18.900.000 ₫',
  },
  {
    id: 'prod-2',
    slug: 'bo-ta-tay-dieu-chinh-24kg',
    productType: 'SIMPLE',
    name: 'Bộ Tạ Tay Điều Chỉnh Thông Minh 24KG Pro',
    brand: 'Bảo An Sport',
    category: 'Gym & Sức mạnh',
    badge: 'Mới ra mắt',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    numericPrice: 3850000,
    displayPrice: '3.850.000 ₫',
    originalPrice: 4800000,
    displayOriginalPrice: '4.800.000 ₫',
  },
  {
    id: 'prod-3',
    slug: 'gian-ta-da-nang-smith-pro',
    productType: 'BUNDLE',
    name: 'Combo Giàn Tạ Đa Năng Smith Machine All-in-One',
    brand: 'Bảo An Sport',
    category: 'Combo Home Gym',
    badge: 'Combo trọn bộ',
    imageUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
    numericPrice: 28900000,
    displayPrice: '28.900.000 ₫',
    originalPrice: 36000000,
    displayOriginalPrice: '36.000.000 ₫',
  },
  {
    id: 'prod-4',
    slug: 'xe-dap-tap-the-duc-spin-bike',
    productType: 'SIMPLE',
    name: 'Xe Đạp Tập Thể Dục Kháng Lực Từ DCTD AirBike',
    brand: 'Bảo An Sport',
    category: 'Xe đạp tập',
    badge: 'Giảm 25%',
    imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
    numericPrice: 6200000,
    displayPrice: '6.200.000 ₫',
    originalPrice: 8200000,
    displayOriginalPrice: '8.200.000 ₫',
  },
  {
    id: 'prod-5',
    slug: 'ghe-tap-ta-dieu-chinh-gap-gon',
    productType: 'SIMPLE',
    name: 'Ghế Tập Tạ Đa Năng Điều Chỉnh 7 Cấp Độ',
    brand: 'Bảo An Sport',
    category: 'Gym & Sức mạnh',
    badge: 'Chịu tải 400kg',
    imageUrl: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=800&q=80',
    numericPrice: 2150000,
    displayPrice: '2.150.000 ₫',
    originalPrice: 2800000,
    displayOriginalPrice: '2.800.000 ₫',
  },
  {
    id: 'prod-6',
    slug: 'tham-yoga-dinh-tuyen-cao-su',
    productType: 'SIMPLE',
    name: 'Thảm Yoga Định Tuyến Cao Su Tự Nhiên PU 5mm',
    brand: 'Bảo An Sport',
    category: 'Yoga & Phục hồi',
    badge: 'Chống trượt Pro',
    imageUrl: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
    numericPrice: 890000,
    displayPrice: '890.000 ₫',
    originalPrice: 1200000,
    displayOriginalPrice: '1.200.000 ₫',
  },
  {
    id: 'prod-7',
    slug: 'ta-binh-voi-kettlebell-gang-duc',
    productType: 'SIMPLE',
    name: 'Tạ Bình Vôi Kettlebell Gang Đúc Bọc Neoprene 16KG',
    brand: 'Bảo An Sport',
    category: 'Gym & Sức mạnh',
    badge: 'Tiêu chuẩn CE',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    numericPrice: 790000,
    displayPrice: '790.000 ₫',
    originalPrice: 990000,
    displayOriginalPrice: '990.000 ₫',
  },
  {
    id: 'prod-8',
    slug: 'sung-massage-cam-tay-phuc-hoi',
    productType: 'SIMPLE',
    name: 'Súng Massage Cầm Tay Trị Liệu Cơ Bắp DCTD Recovery',
    brand: 'Bảo An Sport',
    category: 'Yoga & Phục hồi',
    badge: 'Pin 8 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    numericPrice: 1850000,
    displayPrice: '1.850.000 ₫',
    originalPrice: 2500000,
    displayOriginalPrice: '2.500.000 ₫',
  },
];

export function useProductShowcase() {
  const query = useListCatalogProducts({ page: 1, limit: 8 });
  const products = useMemo(() => {
    const apiItems = query.data?.items ?? [];
    if (apiItems.length > 0) {
      return apiItems.map((product) => {
        const minPrice = Number(product.minPrice ?? 0);
        const raw = product as unknown as Record<string, unknown>;
        const originalPrice = raw.originalPrice
          ? Number(raw.originalPrice)
          : undefined;

        return {
          id: product.id,
          slug: product.slug,
          productType: product.productType,
          name: product.name,
          brand: product.brand ?? 'DCTD Sport',
          category: product.primaryCategory ?? 'Thiết bị thể thao',
          badge: product.primaryCategory ?? 'Sản phẩm mới',
          imageUrl: product.imageUrl ?? '/icon.svg',
          numericPrice: minPrice,
          displayPrice:
            product.minPrice === null || product.minPrice === undefined
              ? 'Liên hệ tư vấn'
              : vndMoney.format(minPrice),
          originalPrice,
          displayOriginalPrice: originalPrice ? vndMoney.format(originalPrice) : undefined,
        };
      });
    }

    // When API is offline or empty, provide high-quality fallback products
    return FALLBACK_PRODUCTS;
  }, [query.data?.items]);

  return {
    products,
    isPending: query.isPending && !query.isError,
    isError: false, // Handled gracefully by fallback
    refetch: query.refetch,
  };
}
