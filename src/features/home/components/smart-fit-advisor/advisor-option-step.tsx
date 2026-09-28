import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { AdvisorOption } from '../../model/smart-fit.constants';

interface AdvisorOptionStepProps<T extends AdvisorOption> {
  title: string;
  options: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  renderCard: (option: T, isSelected: boolean) => ReactNode;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  NextIcon: LucideIcon;
}

export function AdvisorOptionStep<T extends AdvisorOption>({
  title,
  options,
  selectedId,
  onSelect,
  renderCard,
  onBack,
  onNext,
  nextLabel,
  NextIcon,
}: AdvisorOptionStepProps<T>) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-black text-white mb-4">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/60 ring-2 ring-emerald-500/40 shadow-lg'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {renderCard(option, isSelected)}
            </button>
          );
        })}
      </div>

      <div className={`mt-8 flex items-center ${onBack ? 'justify-between' : 'justify-end'}`}>
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-700"
          >
            Quay lại
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 transition hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
        >
          <span>{nextLabel}</span>
          <NextIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
