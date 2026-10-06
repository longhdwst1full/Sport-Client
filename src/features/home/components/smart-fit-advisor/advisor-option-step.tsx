import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { AdvisorOption } from '../../model/smart-fit.constants';

/** Vòng focus trắng trên nền tối của khối tư vấn. */
export const ADVISOR_FOCUS = 'focus-visible:ring-white focus-visible:ring-offset-slate-900';
/** Nút phụ nền tối (Quay lại, Làm lại từ đầu). */
export const ADVISOR_SECONDARY_BUTTON = `border border-slate-700 bg-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-700 ${ADVISOR_FOCUS}`;

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
    <div role="group" aria-label={title}>
      <h3 className="text-base sm:text-lg font-black text-white mb-4">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
                isSelected
                  ? 'border-brand-500 bg-brand-950/60 ring-2 ring-brand-500/40 shadow-lg'
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
          <Button variant="secondary" onClick={onBack} className={`px-5 ${ADVISOR_SECONDARY_BUTTON}`}>
            Quay lại
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          className={`px-6 text-xs font-black uppercase tracking-wider shadow-lg shadow-brand-600/20 ${ADVISOR_FOCUS}`}
        >
          <span>{nextLabel}</span>
          <NextIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
