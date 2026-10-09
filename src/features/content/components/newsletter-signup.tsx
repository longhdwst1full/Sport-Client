'use client';

import { useId, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/foundation/components/buttons';
import { TextInput } from '@/foundation/components/field-system';
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
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
      });
    },
    retry: false,
  });
  const dark = tone === 'dark';

  if (mutation.isSuccess) {
    return (
      <div role="status" className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-bold text-emerald-400 backdrop-blur-md shadow-lg animate-scale-up">
        <CheckCircle2 aria-hidden className="size-5 shrink-0 text-emerald-400 animate-bounce" />
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
            ? 'rounded-xl border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/30 font-medium'
            : 'rounded-xl border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-red-600 font-medium'
        }
      />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
      </div>
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="shrink-0 whitespace-nowrap rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 px-6 text-sm font-black text-white shadow-md shadow-red-600/30 border border-red-500/30 hover:from-red-700 hover:to-rose-700 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
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
