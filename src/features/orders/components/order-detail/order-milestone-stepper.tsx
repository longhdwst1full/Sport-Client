import { Check, Clock, X } from 'lucide-react';
import type { OrderMilestoneView } from '../../model/order.mapper';

/** Tiến trình đơn: stepper ngang từ `sm` trở lên và dạng dọc trên mobile, cùng một danh sách mốc. */
export function OrderMilestoneStepper({ milestones }: { milestones: OrderMilestoneView[] | undefined }) {
  return (
    <>
      {/* Desktop / Tablet Horizontal Stepper (sm: and above) */}
      <div className="hidden sm:block mt-7 mb-4">
        <div className="grid grid-cols-5 gap-2 relative">
          {(milestones ?? []).map((milestone, index, list) => {
            const isDone = milestone.state === 'done';
            const isCurrent = milestone.state === 'current';
            const isFailed = milestone.state === 'failed';

            return (
              <div key={milestone.key} className="relative flex flex-col items-center text-center px-1">
                {/* Connecting line to the next step */}
                {index < list.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-1 -translate-y-1/2 z-0 ${
                      isDone
                        ? 'bg-emerald-500'
                        : isCurrent
                        ? 'bg-gradient-to-r from-emerald-500 to-slate-200'
                        : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Node Circle */}
                <div className="relative z-10 grid size-9 place-items-center rounded-full bg-white">
                  {isDone ? (
                    <span className="grid size-9 place-items-center rounded-full bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-50">
                      <Check className="size-4 stroke-[3]" />
                    </span>
                  ) : isCurrent ? (
                    <span className="relative flex size-9 items-center justify-center">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative grid size-9 place-items-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm ring-4 ring-emerald-50">
                        <span className="size-3 rounded-full bg-emerald-600" />
                      </span>
                    </span>
                  ) : isFailed ? (
                    <span className="grid size-9 place-items-center rounded-full bg-rose-600 text-white shadow-sm ring-4 ring-rose-50">
                      <X className="size-4 stroke-[3]" />
                    </span>
                  ) : (
                    <span className="grid size-9 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-300 ring-4 ring-slate-50">
                      <span className="size-2.5 rounded-full bg-slate-200" />
                    </span>
                  )}
                </div>

                {/* Step Label, Subtitle & Date */}
                <div className="mt-3 w-full">
                  {isCurrent && (
                    <span className="mb-1 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                      Hiện tại
                    </span>
                  )}
                  <strong
                    className={`block text-xs leading-snug ${
                      isCurrent
                        ? 'font-black text-emerald-800 text-sm'
                        : isDone
                        ? 'font-bold text-slate-900'
                        : isFailed
                        ? 'font-bold text-rose-700'
                        : 'font-medium text-slate-400'
                    }`}
                  >
                    {milestone.label}
                  </strong>
                  {milestone.subLabel && (
                    <span className="block mt-0.5 text-[11px] text-slate-500 leading-tight">
                      {milestone.subLabel}
                    </span>
                  )}
                  {milestone.occurredLabel && (
                    <p className="mt-1 text-[11px] font-medium text-slate-400">
                      {milestone.occurredLabel}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Stepper (< sm) */}
      <div className="block sm:hidden mt-5">
        <ol className="space-y-0">
          {(milestones ?? []).map((milestone, index, list) => {
            const isDone = milestone.state === 'done';
            const isCurrent = milestone.state === 'current';
            const isFailed = milestone.state === 'failed';

            return (
              <li key={milestone.key} className="relative flex gap-3.5 pb-6 last:pb-0">
                {index < list.length - 1 && (
                  <span
                    aria-hidden
                    className={`absolute left-[13px] top-6 h-[calc(100%-1rem)] w-0.5 ${
                      isDone ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
                <span className="relative grid size-7 shrink-0 place-items-center rounded-full">
                  {isDone ? (
                    <span className="grid size-7 place-items-center rounded-full bg-emerald-600 text-white shadow-sm">
                      <Check className="size-4 stroke-[2.5]" />
                    </span>
                  ) : isCurrent ? (
                    <span className="relative flex size-7 items-center justify-center">
                      <span className="absolute size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                      <span className="relative grid size-7 place-items-center rounded-full border-2 border-emerald-600 bg-white text-emerald-600 shadow-sm">
                        <span className="size-2.5 rounded-full bg-emerald-600" />
                      </span>
                    </span>
                  ) : isFailed ? (
                    <span className="grid size-7 place-items-center rounded-full bg-rose-600 text-white shadow-sm">
                      <X className="size-4 stroke-[2.5]" />
                    </span>
                  ) : (
                    <span className="grid size-7 place-items-center rounded-full border-2 border-slate-200 bg-white text-slate-300">
                      <span className="size-2 rounded-full bg-slate-200" />
                    </span>
                  )}
                </span>

                <div className="min-w-0 pt-0.5">
                  <div className="flex items-center gap-2">
                    <strong
                      className={`text-sm ${
                        isCurrent
                          ? 'font-black text-emerald-800'
                          : isDone
                          ? 'font-bold text-slate-900'
                          : isFailed
                          ? 'font-bold text-rose-700'
                          : 'font-medium text-slate-400'
                      }`}
                    >
                      {milestone.label}
                    </strong>
                    {isCurrent && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-800">
                        Hiện tại
                      </span>
                    )}
                  </div>
                  {milestone.subLabel && (
                    <p className="text-xs text-slate-500 mt-0.5">{milestone.subLabel}</p>
                  )}
                  {milestone.occurredLabel && (
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="size-3 text-slate-400" />
                      {milestone.occurredLabel}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
