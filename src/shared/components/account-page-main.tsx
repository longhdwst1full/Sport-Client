import type { ComponentPropsWithoutRef } from 'react';

/** Class literal đầy đủ để Tailwind JIT nhận diện (RULE-DS-03). */
const WIDTH_CLASS = {
  xl: 'mx-auto min-h-[60vh] max-w-xl px-4 py-10 sm:px-6',
  '3xl': 'mx-auto min-h-[60vh] max-w-3xl px-4 py-10 sm:px-6',
  '4xl': 'mx-auto min-h-[60vh] max-w-4xl px-4 py-10 sm:px-6',
  '5xl': 'mx-auto min-h-[60vh] max-w-5xl px-4 py-10 sm:px-6',
  '6xl': 'mx-auto min-h-[60vh] max-w-6xl px-4 py-10 sm:px-6',
} as const;

export type AccountPageMainWidth = keyof typeof WIDTH_CLASS;

/** Thẻ `<main>` chung cho các trang khu vực tài khoản; chỉ khác nhau ở độ rộng tối đa. */
export function AccountPageMain({
  width,
  className,
  ...rest
}: { width: AccountPageMainWidth } & ComponentPropsWithoutRef<'main'>) {
  const base = WIDTH_CLASS[width];
  return <main className={className ? `${base} ${className}` : base} {...rest} />;
}
