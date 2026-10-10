'use client';

import { useId, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { TextInput, HoneypotField } from '@/foundation/components/field-system';
import { createNewsletterSubscription } from '@/generated/api/content/content';
import { apiErrorMessage } from '@/lib/api/error-message';

export function NewsletterSignup({ source, tone = 'light' }: { source: string; tone?: 'light' | 'dark' }) {
  const inputId = useId();
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const mutation = useMutation({
    mutationFn: () =>
      createNewsletterSubscription({ email: email.trim(), source, ...(website ? { website } : {}) }),
    onSuccess: () => {
      // Confetti chỉ tải khi đăng ký thành công (dynamic import), không nằm trong JS tải trang.
      void import('canvas-confetti').then(({ default: confetti }) =>
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
        }),
      );
    },
    retry: false,
  });
  const dark = tone === 'dark';

  if (mutation.isSuccess) {
    return (
      <div role="status" className="inline-flex items-center gap-2 rounded-2xl border border-success-500/30 bg-success-500/10 px-4 py-2 text-sm font-bold text-success-400 backdrop-blur-md shadow-lg animate-scale-up">
        <CheckCircle2 aria-hidden className="size-5 shrink-0 text-success-400 animate-bounce" />
        <span>Đã đăng ký nhận tin thành công! Cảm ơn bạn.</span>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        if (!mutation.isPending) mutation.mutate();
      }}
    >
      <label htmlFor={inputId} className="sr-only">Email nhận tin</label>
      <TextInput
        id={inputId}
        size="md"
        type="email"
        required
        maxLength={254}
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Nhập email của bạn..."
        className={
          dark
            ? 'rounded-xl border-neutral-700 bg-neutral-900/90 text-white placeholder:text-neutral-400 focus:border-white focus:ring-2 focus:ring-white/20 font-medium'
            : 'rounded-xl border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20 font-medium'
        }
      />
      <HoneypotField value={website} onChange={setWebsite} />
      <Button
        type="submit"
        variant={dark ? 'inverse' : 'primary'}
        disabled={mutation.isPending}
        className="shrink-0 whitespace-nowrap px-5"
      >
        <span>{mutation.isPending ? 'Đang gửi…' : 'Nhận tin'}</span>
      </Button>
      {mutation.isError && (
        <p role="alert" className={`text-xs sm:basis-full ${dark ? 'text-red-300' : 'text-red-700'}`}>
          {apiErrorMessage(mutation.error, 'Không đăng ký được. Vui lòng thử lại.')}
        </p>
      )}
    </form>
  );
}
