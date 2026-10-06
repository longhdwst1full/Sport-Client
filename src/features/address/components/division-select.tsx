import { useId } from 'react';
import { ChevronDown, RefreshCw } from 'lucide-react';
import { Spinner } from '@/foundation/components/feedback';

interface DivisionOption {
  code: string;
  name: string;
}

interface DivisionSelectProps {
  label: string;
  required: boolean;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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

  return (
    <div>
      <label htmlFor={selectId} className="block text-xs font-bold uppercase tracking-wider text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative mt-1.5">
        <select
          id={selectId}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          aria-busy={isLoading || undefined}
          className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 text-base font-semibold text-slate-800 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:bg-slate-50 disabled:text-slate-500 sm:text-sm ${
            error ? 'border-rose-300' : 'border-slate-200'
          }`}
        >
          <option value="">{emptyOptionLabel}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500">
          {isLoading ? (
            <Spinner className="size-4 animate-spin text-brand-600" />
          ) : (
            <ChevronDown className="size-4" aria-hidden />
          )}
        </div>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-rose-700">
          <span>{error}</span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 rounded font-bold text-brand-700 underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <RefreshCw className="size-3.5" aria-hidden />
              Thử lại
            </button>
          )}
        </p>
      )}
    </div>
  );
}
