import { ContactActions } from '@/shared/components/contact-actions';

/** CTA tư vấn cuối bài viết: nền xám nhạt, nút liên hệ dùng chung (`ContactActions`). */
export function ArticleConsultationCta() {
  return (
    <aside className="my-12 rounded-2xl bg-neutral-50 p-6 sm:p-8">
      <span className="eyebrow text-neutral-500">Tư vấn 1:1</span>
      <h2 className="mt-2 text-xl font-bold leading-tight text-neutral-950 sm:text-2xl">
        Cần chọn thiết bị cho phòng tập hoặc gia đình?
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
        Nhân viên Bảo An Sport tư vấn theo diện tích, mục tiêu tập và ngân sách, kèm báo giá giao và lắp đặt.
      </p>
      <ContactActions className="mt-5" contactLabel="Hệ thống showroom" />
    </aside>
  );
}
