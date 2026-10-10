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
      <h3 className="text-base sm:text-lg font-bold text-white mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`group flex flex-col justify-between rounded-2xl border p-4 text-left sm:p-5 transition-all duration-300 focus-ring ${
                isSelected
                  ? 'border-neutral-400 bg-neutral-850 ring-2 ring-white/20 shadow-lg -translate-y-1'
                  : 'border-neutral-800 bg-neutral-900/90 hover:border-neutral-700 hover:bg-neutral-800 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {renderCard(option, isSelected)}
            </button>
          );
        })}
      </div>

      <div className={`mt-8 flex items-center ${onBack ? 'justify-between' : 'justify-end'}`}>
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="px-5 border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 font-bold">
            Quay lại
          </Button>
        )}
        <Button
          variant="inverse"
          size="lg"
          onClick={onNext}
          className="gap-2 px-6 text-sm font-bold shadow-md"
        >
          <span>{nextLabel}</span>
          <NextIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
