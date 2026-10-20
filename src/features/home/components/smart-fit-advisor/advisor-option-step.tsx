import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import type { AdvisorOption } from '../../model/smart-fit.constants';

/**
 * Thẻ lựa chọn trên khối sáng: chưa chọn = thẻ trắng viền xám (kiểu `card-interactive`), đang chọn = token
 * `selected` (nền brand-50, viền brand-300) như `ToggleChip` — không dùng nền đen cho trạng thái chọn.
 */
const OPTION_CARD_BASE =
  'group flex flex-col justify-between rounded-xl border p-4 text-left sm:p-5 transition-colors duration-200 focus-ring';
const OPTION_CARD_STATE = {
  selected: 'border-selected-border bg-selected',
  idle: 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-card',
} as const;

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
      <h3 className="text-base sm:text-lg font-bold text-neutral-950 mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {options.map((option) => {
          const isSelected = selectedId === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              aria-pressed={isSelected}
              className={`${OPTION_CARD_BASE} ${isSelected ? OPTION_CARD_STATE.selected : OPTION_CARD_STATE.idle}`}
            >
              {renderCard(option, isSelected)}
            </button>
          );
        })}
      </div>

      <div className={`mt-8 flex items-center ${onBack ? 'justify-between' : 'justify-end'}`}>
        {onBack && (
          <Button variant="secondary" onClick={onBack} className="px-5">
            Quay lại
          </Button>
        )}
        {/* Hành động chính của khối: `primary` (đỏ thương hiệu, chữ trắng). */}
        <Button variant="primary" size="lg" onClick={onNext} className="px-6">
          <span>{nextLabel}</span>
          <NextIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
