import { Skeleton } from '@/foundation/components/feedback';

/**
 * Giữ chỗ cho `FlashSaleSection` (trang chủ) trong lúc chunk của khối tải: chung khung (nền, padding, viền)
 * và chiều cao với khối thật (đo trên 390/768/1366px: 667/716/767px) nên hero bên dưới không bị đẩy xuống
 * rồi kéo lên khi khối được vẽ lại. Chỉ dùng khi server đã biết có chiến dịch; không có chiến dịch thì
 * không giữ chỗ để khỏi chừa một khoảng trống.
 */
export function FlashSaleSlotPlaceholder() {
  return (
    <section className="bg-brand-50/60 py-6 sm:py-10" aria-hidden="true">
      <div className="page-container">
        <div className="h-[619px] overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm sm:h-[636px] lg:h-[687px]">
          <Skeleton className="h-[180px] w-full rounded-none sm:h-[118px]" />
          <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-5 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="aspect-[3/4] w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
