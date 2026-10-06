'use client';

import { useId, useState } from 'react';

/**
 * GAP: chưa có API đăng ký nhận tin công khai trong contract Storefront. Form không giả vờ thành công:
 * khi gửi chỉ báo rõ tính năng chưa mở và chỉ kênh liên hệ thay thế. Có endpoint thì nối vào đây.
 */
export function NewsletterForm() {
  const inputId = useId();
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
      <label htmlFor={inputId} className="sr-only">
        Email nhận tin
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder="Email của bạn"
        className="min-h-12 w-full rounded-xl border border-white/20 bg-white/10 px-5 text-sm text-white placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/40 sm:max-w-sm"
      />
      <button
        type="submit"
        className="min-h-12 shrink-0 rounded-xl bg-brand-600 px-7 font-bold text-white transition-colors hover:bg-brand-700 focus-visible:outline-white"
      >
        Đăng ký
      </button>
      <p id={statusId} role="status" className="text-sm text-amber-300 sm:basis-full">
        {submitted
          ? 'Tính năng nhận tin qua email đang được chuẩn bị. Vui lòng theo dõi Fanpage/Zalo hoặc gọi hotline để nhận ưu đãi mới nhất.'
          : ''}
      </p>
    </form>
  );
}
