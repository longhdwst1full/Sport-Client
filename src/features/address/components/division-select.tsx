import { useId, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/foundation/components/buttons';
import { InlineAlert, Spinner } from '@/foundation/components/feedback';
import { Combobox, Field } from '@/foundation/components/field-system';

interface DivisionOption {
  code: string;
  name: string;
}

interface DivisionSelectProps {
  label: string;
  required: boolean;
  value: string | null;
  onChange: (code: string | null) => void;
  disabled: boolean;
  isLoading: boolean;
  emptyOptionLabel: string;
  options: DivisionOption[];
  /** Có lỗi tải danh mục: hiện thông báo + nút thử lại thay vì một dropdown rỗng im lặng. */
  error?: string;
  onRetry?: () => void;
}

export function DivisionSelect({
  label,
  required,
  value,
  onChange,
  disabled,
  isLoading,
  emptyOptionLabel,
  options,
  error,
  onRetry,
}: DivisionSelectProps) {
  const selectId = useId();
  const errorId = `${selectId}-error`;
  const comboOptions = useMemo(() => options.map((o) => ({ value: o.code, label: o.name })), [options]);

  return (
    <div>
      <Field
        label={<>{label} {required && <span className="text-red-600">*</span>}</>}
        labelClassName="block text-xs font-bold text-neutral-700"
        htmlFor={selectId}
      >
        <div className="relative mt-1.5">
          <Combobox
            id={selectId}
            value={value}
            options={comboOptions}
            onChange={onChange}
            placeholder={emptyOptionLabel}
            emptyText={`Không tìm thấy ${label.toLowerCase()} phù hợp`}
            required={required}
            disabled={disabled}
            invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            aria-busy={isLoading || undefined}
            className="font-semibold text-neutral-800 placeholder:font-medium"
          />
          {/* Đang tải luôn kèm `disabled` (nền neutral-50) → spinner phủ lên mũi tên của ô chọn. */}
          {isLoading && (
            <span className="pointer-events-none absolute right-2 top-1/2 grid size-6 -translate-y-1/2 place-items-center bg-neutral-50">
              <Spinner className="size-4 animate-spin text-neutral-900" />
            </span>
          )}
        </div>
      </Field>
      {error && (
        <InlineAlert as="p" role="alert" className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-red-700">
          <span id={errorId}>{error}</span>
          {onRetry && (
            <Button variant="link" onClick={onRetry} className="gap-1 rounded font-bold underline-offset-2">
              <RefreshCw className="size-3.5" aria-hidden />
              Thử lại
            </Button>
          )}
        </InlineAlert>
      )}
    </div>
  );
}
