import type { Metadata } from 'next';
import { VnpayReturnPage } from '@/features/checkout';
import { verifyVnpayReturn } from '@/generated/api/payments/payments';
import type { VnpayReturnDto, VerifyVnpayReturnParams } from '@/generated/api/payments/models';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Kết quả thanh toán VNPay — Bảo An Sport',
  // Trang kết quả giao dịch của từng khách, không được để công cụ tìm kiếm lập chỉ mục.
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  // Chữ ký do backend kiểm; client chỉ chuyển tiếp nguyên vẹn tham số VNPay gửi về.
  const query = Object.fromEntries(
    Object.entries(params).flatMap(([key, value]) =>
      key.startsWith('vnp_') && typeof value === 'string' ? [[key, value]] : [],
    ),
  ) as VerifyVnpayReturnParams;

  let result: VnpayReturnDto;
  try {
    result = await verifyVnpayReturn(query);
  } catch {
    result = {
      displayStatus: 'INVALID',
      message: 'Không kết nối được để xác minh giao dịch. Vui lòng kiểm tra trang đơn hàng.',
    };
  }

  return <VnpayReturnPage result={result} />;
}
