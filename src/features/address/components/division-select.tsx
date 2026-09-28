import { ChevronDown, Loader2 } from 'lucide-react';

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
}: DivisionSelectProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className="relative mt-1.5">
        <select
          value={value ?? ''}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-slate-400 sm:text-sm"
        >
          <option value="">{emptyOptionLabel}</option>
          {options.map((o) => (
            <option key={o.code} value={o.code}>
              {o.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin text-emerald-600" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </div>
      </div>
    </div>
  );
}
