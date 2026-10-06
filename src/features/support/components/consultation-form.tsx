'use client';

import { useId, useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';

export function ConsultationForm() {
  const fieldId = useId();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    spaceSize: '10-20m2',
    purpose: 'home-gym',
    note: '',
  });

  /**
   * Backend chưa có endpoint nhận yêu cầu tư vấn.
   *
   * Bản trước chỉ `setSubmitted(true)` rồi báo "Gửi yêu cầu thành công" — không có gì rời khỏi
   * trình duyệt, nên khách ngồi đợi một cuộc gọi không bao giờ tới. Ở đây mở sẵn email soạn thảo
   * với đúng nội dung họ vừa nhập: việc gửi là thật, do chính ứng dụng mail của họ thực hiện, và
   * thông báo chỉ nói đúng điều đã xảy ra.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Yêu cầu tư vấn thiết kế phòng tập — ${form.name}`;
    const body = [
      `Họ và tên: ${form.name}`,
      `Số điện thoại: ${form.phone}`,
      `Email: ${form.email || '(không cung cấp)'}`,
      `Diện tích: ${form.spaceSize}`,
      `Mục đích: ${form.purpose}`,
      '',
      'Ghi chú:',
      form.note || '(không có)',
    ].join('\n');
    window.location.href = `mailto:${STORE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-black text-ink">Đăng ký tư vấn thiết kế Home Gym</h2>
      <p className="mt-1 text-xs text-stone-600">
        Đội ngũ kỹ sư thể hình {STORE_CONFIG.name} sẽ liên hệ gửi bản vẽ 3D và báo giá tối ưu trong 30 phút.
      </p>

      {submitted ? (
        <div role="status" className="mt-8 rounded-2xl bg-success-50 p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success-600" aria-hidden />
          <h3 className="mt-3 text-lg font-bold text-ink">Đã mở email soạn sẵn</h3>
          <p className="mt-1 text-xs text-stone-600">
            Nội dung bạn vừa nhập đã được điền sẵn vào email gửi tới {STORE_CONTACT.email}.
            <strong className="text-ink"> Yêu cầu chỉ đến với chúng tôi sau khi bạn bấm gửi trong ứng dụng email.</strong>
          </p>
          <p className="mt-2 text-xs text-stone-600">
            Không mở được email? Gọi trực tiếp{' '}
            <a
              href={`tel:${STORE_CONTACT.primaryHotline.replace(/\s/g, '')}`}
              className="font-bold text-brand-700 underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              {STORE_CONTACT.primaryHotline}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="mt-5 min-h-11 rounded-full bg-ink px-6 py-2.5 text-xs font-bold text-white transition hover:bg-ink/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Soạn yêu cầu khác
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor={`${fieldId}-name`} className="block text-xs font-bold uppercase text-stone-600">Họ và tên *</label>
            <input
              required
              value={form.name}
              id={`${fieldId}-name`}
              autoComplete="name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${fieldId}-phone`} className="block text-xs font-bold uppercase text-stone-600">Số điện thoại *</label>
              <input
                required
                type="tel"
                autoComplete="tel"
                value={form.phone}
              id={`${fieldId}-phone`}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="0912 345 678"
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
            <div>
              <label htmlFor={`${fieldId}-email`} className="block text-xs font-bold uppercase text-stone-600">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={form.email}
              id={`${fieldId}-email`}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor={`${fieldId}-spaceSize`} className="block text-xs font-bold uppercase text-stone-600">Diện tích dự kiến</label>
              <select
                value={form.spaceSize}
              id={`${fieldId}-spaceSize`}
                onChange={(e) => setForm({ ...form, spaceSize: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="under-10m2">Dưới 10m² (Góc tập nhỏ)</option>
                <option value="10-20m2">10m² - 20m² (Phòng ngủ / Ban công)</option>
                <option value="20-50m2">20m² - 50m² (Tầng thượng / Sân thượng)</option>
                <option value="over-50m2">Trên 50m² (Phòng Gym chuyên nghiệp)</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${fieldId}-purpose`} className="block text-xs font-bold uppercase text-stone-600">Mục tiêu tập luyện</label>
              <select
                value={form.purpose}
              id={`${fieldId}-purpose`}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
              >
                <option value="home-gym">Tăng cơ & Giảm mỡ toàn thân</option>
                <option value="cardio">Cardio & Giảm cân chạy bộ</option>
                <option value="rehab">Phục hồi chức năng & Yoga</option>
                <option value="commercial">Mở phòng tập thể hình kinh doanh</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor={`${fieldId}-note`} className="block text-xs font-bold uppercase text-stone-600">Ghi chú thêm</label>
            <textarea
              rows={3}
              value={form.note}
              id={`${fieldId}-note`}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Mô tả ngân sách dự kiến hoặc yêu cầu đặc biệt..."
              className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-3 text-base sm:text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-4 font-black text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <Send className="size-4" aria-hidden />
            <span>Soạn email yêu cầu tư vấn</span>
          </button>
        </form>
      )}
    </div>
  );
}
