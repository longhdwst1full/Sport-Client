'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Mail, Send } from 'lucide-react';
import { useCustomerAuth } from '@/features/auth';
import { InlineAlert } from '@/foundation/components/feedback';
import { Button } from '@/foundation/components/buttons';
import { Field, Select, Textarea, TextInput } from '@/foundation/components/field-system';
import { STORE_CONFIG, STORE_CONTACT } from '@/shared/constants';
import { useCreateSupportRequest } from '../hooks/use-create-support-request';
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
  const [mailtoOpened, setMailtoOpened] = useState(false);
  const create = useCreateSupportRequest();
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
   * Khách đã đăng nhập: gửi thẳng thành phiếu hỗ trợ (`createSupportRequest`) — có mã phiếu, nhân
   * viên nhận trong hàng đợi, khách theo dõi ở "Hỗ trợ của tôi".
   * Khách vãng lai: Backend chưa có endpoint nhận yêu cầu không cần đăng nhập, nên mở email soạn sẵn
   * và đẩy hotline/Zalo lên trước; thông báo chỉ nói đúng điều đã xảy ra (email chưa được gửi).
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      create.submit({ subject, message });
      return;
    }
    window.location.href = `mailto:${STORE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    setMailtoOpened(true);
  };

  const resetForm = () => {
    setMailtoOpened(false);
    create.reset();
  };

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
          <Button variant="secondary" onClick={resetForm} className="mt-5 rounded-full bg-ink px-6 text-xs font-bold hover:bg-ink/90">
            Gửi yêu cầu khác
          </Button>
        </div>
      ) : mailtoOpened ? (
        <div role="status" className="mt-8 rounded-2xl bg-neutral-50 p-6 text-center">
          <Mail className="mx-auto size-12 text-neutral-700" aria-hidden />
          <h3 className="mt-3 text-lg font-bold text-ink">Đã mở email soạn sẵn</h3>
          <p className="mt-1 text-xs text-neutral-600">
            Nội dung đã được điền vào email gửi tới {STORE_CONTACT.email}.
            <strong className="text-ink"> Yêu cầu chỉ đến với chúng tôi sau khi bạn bấm gửi trong ứng dụng email.</strong>
          </p>
          <p className="mt-2 text-xs text-neutral-600">
            Không mở được email? Gọi{' '}
            <a href={`tel:${STORE_CONTACT.primaryHotlineRaw}`} className={LINK_CLASS}>{STORE_CONTACT.primaryHotline}</a>
            {' '}hoặc <Link href="/login" className={LINK_CLASS}>đăng nhập</Link> để gửi yêu cầu trực tiếp.
          </p>
          <Button variant="secondary" onClick={resetForm} className="mt-5 rounded-full bg-ink px-6 text-xs font-bold hover:bg-ink/90">
            Soạn yêu cầu khác
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
            disabled={create.isPending}
            className="h-12"
          >
            <Send className="size-4" aria-hidden />
            <span>{isAuthenticated ? (create.isPending ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn') : 'Soạn email yêu cầu tư vấn'}</span>
          </Button>
          {create.errorMessage && <InlineAlert role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{create.errorMessage}</InlineAlert>}
          {!isAuthenticated && (
            <p className="text-center text-xs text-neutral-600">
              <Link href="/login" className={LINK_CLASS}>Đăng nhập</Link> để gửi yêu cầu trực tiếp và nhận mã theo dõi.
            </p>
          )}
        </form>
      )}
    </div>
  );
}
