import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { AdvisorOption } from '../../model/smart-fit.constants';

/** Vòng focus trắng trên nền tối của khối tư vấn. */
/** Nút phụ (Quay lại, Làm lại từ đầu) — dùng variant `secondary` trắng viền mảnh. */
export const ADVISOR_SECONDARY_BUTTON = 'text-xs font-semibold';

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
      <h3 className="text-base sm:text-lg font-semibold text-neutral-950 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`group flex flex-col justify-between rounded-2xl border p-4 text-left sm:p-5 transition-all duration-200 focus-ring ${
                isSelected
                  ? 'border-red-600 bg-white ring-2 ring-red-500/20 shadow-md -translate-y-0.5'
                  : 'border-slate-200/90 bg-white hover:border-slate-400 hover:shadow-xs hover:-translate-y-0.5'
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
          className="px-6 text-sm"
        >
          <span>{nextLabel}</span>
          <NextIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
