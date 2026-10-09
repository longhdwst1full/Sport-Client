import { ContactActions } from '@/shared/components/contact-actions';

/** CTA tư vấn cuối bài viết: nền xám nhạt, nút liên hệ dùng chung (`ContactActions`). */
export function ArticleConsultationCta() {
  return (
    <aside className="my-12 rounded-3xl border border-slate-200/90 bg-gradient-to-br from-slate-100/90 via-white to-slate-100/60 p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50/80 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-red-600 shadow-2xs">
        <span className="size-1.5 rounded-full bg-red-600 animate-pulse" />
        Tư vấn 1:1 chuyên sâu
      </div>
      <h2 className="mt-3 text-xl font-black leading-tight text-slate-900 sm:text-2xl lg:text-3xl">
        Cần Chọn Thiết Bị Cho Phòng Tập Hoặc Gia Đình?
      </h2>
      <p className="mt-2 max-w-2xl text-xs sm:text-sm font-medium leading-relaxed text-slate-600">
        Nhân viên Bảo An Sport tư vấn theo diện tích, mục tiêu tập và ngân sách, kèm báo giá giao và lắp đặt tận nơi.
      </p>
      <ContactActions className="mt-6" contactLabel="Hệ thống showroom" />
    </aside>
  );
}
