'use client';

import { useId, useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { TextInput } from '@/foundation/components/field-system';

/**
 * GAP: chưa có API đăng ký nhận tin công khai trong contract Storefront. Form không giả vờ thành công:
 * khi gửi chỉ báo rõ tính năng chưa mở và chỉ kênh liên hệ thay thế. Có endpoint thì nối vào đây.
 */
export function NewsletterForm() {
  const statusId = useId();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mx-auto max-w-md">
      <form
        className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md shadow-lg transition-all focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-400/30"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        aria-describedby={submitted ? statusId : undefined}
      >
        <div className="relative flex-1 min-w-0 flex items-center">
          <Mail className="pointer-events-none absolute left-3.5 size-4 text-slate-400" aria-hidden="true" />
          <TextInput
            type="email"
            name="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Nhập email của bạn..."
            className="h-11 w-full border-0 bg-transparent pl-10 pr-3 text-sm text-white placeholder:text-slate-400 outline-none focus:outline-none focus-visible:ring-0"
            aria-label="Email nhận tin"
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          className="h-11 shrink-0 rounded-xl px-6 text-sm font-bold shadow-sm focus-visible:ring-white focus-visible:ring-offset-slate-900"
        >
          Đăng ký
        </Button>
      </form>
      {submitted && (
        <p id={statusId} role="status" className="mt-2.5 text-center text-xs text-amber-300">
          Tính năng nhận tin qua email đang được chuẩn bị. Vui lòng theo dõi Fanpage/Zalo hoặc gọi hotline để nhận ưu đãi mới nhất.
        </p>
      )}
    </div>
  );
}
