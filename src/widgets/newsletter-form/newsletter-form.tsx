'use client';

export function NewsletterForm() {
  return (
    <form
      className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Email của bạn"
        className="w-full rounded-xl border border-white/15 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 sm:max-w-sm"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-emerald-400 px-7 py-3.5 font-bold text-ink transition hover:bg-emerald-300"
      >
        Đăng ký
      </button>
    </form>
  );
}
