'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Send } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { InlineAlert } from '@/foundation/components/feedback';
import { Button } from '@/foundation/components/buttons';
import { Field, Select, Textarea, TextInput, HoneypotField } from '@/foundation/components/field-system';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';
import { useCreateSupportRequest } from '../hooks/use-create-support-request';
import { useCreateConsultationRequest } from '../hooks/use-create-consultation-request';
import { SUPPORT_ROUTES } from '../model/support-ticket.constants';

const LABEL_CLASS = 'block text-xs font-bold uppercase text-neutral-600';

const SPACE_LABELS: Record<string, string> = {
  'under-10m2': 'Dưới 10m²',
  '10-20m2': '10m² - 20m²',
  '20-50m2': '20m² - 50m²',
  'over-50m2': 'Trên 50m²',
};
const PURPOSE_LABELS: Record<string, string> = {
  'home-gym': 'Tăng cơ & giảm mỡ toàn thân',
  cardio: 'Cardio & giảm cân',
  rehab: 'Phục hồi chức năng & yoga',
  commercial: 'Mở phòng tập kinh doanh',
};

const LINK_CLASS = 'font-bold text-neutral-900 underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500';

export function ConsultationForm() {
  const fieldId = useId();
  const { isAuthenticated } = useCustomerAuth();
  const create = useCreateSupportRequest();
  const guest = useCreateConsultationRequest();
  // Bẫy bot: ô ẩn với người dùng; bot điền vào thì API trả 400.
  const [website, setWebsite] = useState('');
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    spaceSize: '10-20m2',
    purpose: 'home-gym',
    note: '',
  });

  const subject = `Yêu cầu tư vấn Home Gym — ${form.name.trim()}`;
  const message = [
    `Họ và tên: ${form.name.trim()}`,
    `Số điện thoại: ${form.phone.trim()}`,
    `Email: ${form.email.trim() || '(không cung cấp)'}`,
    `Diện tích: ${SPACE_LABELS[form.spaceSize] ?? form.spaceSize}`,
    `Mục tiêu: ${PURPOSE_LABELS[form.purpose] ?? form.purpose}`,
    '',
    'Ghi chú:',
    form.note.trim() || '(không có)',
  ].join('\n');

  /**
   * Khách đã đăng nhập: phiếu hỗ trợ gắn hồ sơ (`createSupportRequest`), theo dõi ở "Hỗ trợ của tôi".
   * Khách vãng lai: `createConsultationRequest` (không cần đăng nhập) — phiếu vào chung hàng đợi
   * nhân viên, trả mã phiếu; API giới hạn 3 yêu cầu/SĐT/24 giờ.
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      create.submit({ subject, message });
      return;
    }
    guest.submit({
      name: form.name.trim(),
      phone: form.phone.trim(),
      ...(form.email.trim() ? { email: form.email.trim() } : {}),
      topic: 'Tư vấn Home Gym',
      spaceSize: SPACE_LABELS[form.spaceSize] ?? form.spaceSize,
      purpose: PURPOSE_LABELS[form.purpose] ?? form.purpose,
      message: form.note.trim() || 'Khách chưa ghi chú thêm.',
      ...(website ? { website } : {}),
    });
  };

  const resetForm = () => {
    create.reset();
    guest.reset();
  };

  const pending = create.isPending || guest.isPending;
  const errorMessage = create.errorMessage ?? guest.errorMessage;

  return (
    <div className="surface-card p-6 shadow-sm sm:p-8">
      <h2 className="text-xl font-bold text-ink">Đăng ký tư vấn thiết kế Home Gym</h2>
      <p className="mt-1 text-xs text-neutral-600">
        Nhân viên {STORE_CONFIG.name} liên hệ lại trong giờ làm việc ({STORE_CONTACT.openingHoursShort}).
        Cần gấp? Gọi{' '}
        <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className={LINK_CLASS}>{STORE_CONTACT.primaryHotline}</a>
        {' '}hoặc nhắn{' '}
        <a href={STORE_CONTACT.zaloUrl} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>Zalo</a>.
      </p>

      {create.created ? (
        <div role="status" className="mt-8 rounded-2xl bg-success-50 p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success-600" aria-hidden />
          <h3 className="mt-3 text-lg font-bold text-ink">Đã nhận yêu cầu #{create.created.ticketNo}</h3>
          <p className="mt-1 text-xs text-neutral-600">
            Nhân viên sẽ liên hệ trong giờ làm việc ({STORE_CONTACT.openingHoursShort}). Bạn theo dõi phản hồi tại{' '}
            <Link href={SUPPORT_ROUTES.detail(create.created.ticketNo)} className={LINK_CLASS}>Hỗ trợ của tôi</Link>.
          </p>
          <Button variant="secondary" onClick={resetForm} className="mt-5 rounded-full px-6 text-xs">
            Gửi yêu cầu khác
          </Button>
        </div>
      ) : guest.ticketNo ? (
        <div role="status" className="mt-8 rounded-2xl bg-success-50 p-6 text-center">
          <CheckCircle2 className="mx-auto size-12 text-success-600" aria-hidden />
          <h3 className="mt-3 text-lg font-bold text-ink">Đã nhận yêu cầu #{guest.ticketNo}</h3>
          <p className="mt-1 text-xs text-neutral-600">
            Nhân viên sẽ gọi lại số bạn để lại trong giờ làm việc ({STORE_CONTACT.openingHoursShort}). Cần gấp? Gọi{' '}
            <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className={LINK_CLASS}>{STORE_CONTACT.primaryHotline}</a>.
          </p>
          <Button variant="secondary" onClick={resetForm} className="mt-5 rounded-full px-6 text-xs">
            Gửi yêu cầu khác
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Field label="Họ và tên *" labelClassName={LABEL_CLASS}>
              <TextInput
                size="lg"
                required
                maxLength={120}
                value={form.name}
                id={`${fieldId}-name`}
                autoComplete="name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="mt-1.5"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Số điện thoại *" labelClassName={LABEL_CLASS}>
                <TextInput
                  size="lg"
                  required
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  id={`${fieldId}-phone`}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="0912 345 678"
                  className="mt-1.5"
                />
              </Field>
            </div>
            <div>
              <Field label="Email" labelClassName={LABEL_CLASS}>
                <TextInput
                  size="lg"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  id={`${fieldId}-email`}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="mt-1.5"
                />
              </Field>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Field label="Diện tích dự kiến" labelClassName={LABEL_CLASS}>
                <Select
                  size="lg"
                  value={form.spaceSize}
                  id={`${fieldId}-spaceSize`}
                  onChange={(e) => setForm({ ...form, spaceSize: e.target.value })}
                  wrapperClassName="mt-1.5"
                >
                  <option value="under-10m2">Dưới 10m² (Góc tập nhỏ)</option>
                  <option value="10-20m2">10m² - 20m² (Phòng ngủ / Ban công)</option>
                  <option value="20-50m2">20m² - 50m² (Tầng thượng / Sân thượng)</option>
                  <option value="over-50m2">Trên 50m² (Phòng Gym chuyên nghiệp)</option>
                </Select>
              </Field>
            </div>

            <div>
              <Field label="Mục tiêu tập luyện" labelClassName={LABEL_CLASS}>
                <Select
                  size="lg"
                  value={form.purpose}
                  id={`${fieldId}-purpose`}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  wrapperClassName="mt-1.5"
                >
                  <option value="home-gym">Tăng cơ & Giảm mỡ toàn thân</option>
                  <option value="cardio">Cardio & Giảm cân chạy bộ</option>
                  <option value="rehab">Phục hồi chức năng & Yoga</option>
                  <option value="commercial">Mở phòng tập thể hình kinh doanh</option>
                </Select>
              </Field>
            </div>
          </div>

          <div>
            <Field label="Ghi chú thêm" labelClassName={LABEL_CLASS}>
              <Textarea
                styled
                rows={3}
                maxLength={3000}
                value={form.note}
                id={`${fieldId}-note`}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Mô tả ngân sách dự kiến hoặc yêu cầu đặc biệt..."
                className="mt-1.5"
              />
            </Field>
          </div>

          <Button
            type="submit"
            variant="cta"
            size="lg"
            fullWidth
            disabled={pending}
            className="h-12"
          >
            <Send className="size-4" aria-hidden />
            <span>{pending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}</span>
          </Button>
          {errorMessage && <InlineAlert role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{errorMessage}</InlineAlert>}
          <HoneypotField value={website} onChange={setWebsite} />
        </form>
      )}
    </div>
  );
}
