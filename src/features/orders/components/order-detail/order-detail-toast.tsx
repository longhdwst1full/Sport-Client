import { CheckCircle2 } from 'lucide-react';

export function OrderDetailToast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl border border-slate-700 animate-fade-in-up">
      <CheckCircle2 className="size-4 text-success-400 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
