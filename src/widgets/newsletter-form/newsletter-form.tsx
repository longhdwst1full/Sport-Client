'use client';

import { useId, useState } from 'react';
import { Button } from '@/foundation/components/buttons';
import { Field, TextInput } from '@/foundation/components/field-system';

/**
 * GAP: chưa có API đăng ký nhận tin công khai trong contract Storefront. Form không giả vờ thành công:
 * khi gửi chỉ báo rõ tính năng chưa mở và chỉ kênh liên hệ thay thế. Có endpoint thì nối vào đây.
 */
export function NewsletterForm() {
  const statusId = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mx-auto flex max-w-lg flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      aria-describedby={submitted ? statusId : undefined}
    >
      <Field label="Email nhận tin" labelClassName="sr-only">
        <TextInput
          type="email"
          name="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="Email của bạn"
          className="min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 sm:max-w-sm"
        />
      </Field>
      <Button type="submit" variant="primary" size="lg" className="shrink-0 px-7 font-bold focus-visible:ring-white focus-visible:ring-offset-slate-900">
        Đăng ký
      </Button>
      <p id={statusId} role="status" className="text-sm text-amber-300 sm:basis-full">
        {submitted
          ? 'Tính năng nhận tin qua email đang được chuẩn bị. Vui lòng theo dõi Fanpage/Zalo hoặc gọi hotline để nhận ưu đãi mới nhất.'
          : ''}
      </p>
    </form>
  );
}
