import { useState, type ReactNode } from 'react';

/**
 * Copy-to-clipboard button that owns its own "just copied" timeout so call
 * sites stop duplicating that state. Callers pass their exact previous
 * idle/copied icons and className — this primitive invents neither.
 */
export function CopyButton({
  value,
  onCopied,
  className,
  title,
  idleIcon,
  copiedIcon,
  resetDelayMs = 2000,
}: {
  value: string;
  onCopied?: () => void;
  className?: string;
  title?: string;
  idleIcon: ReactNode;
  copiedIcon: ReactNode;
  resetDelayMs?: number;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), resetDelayMs);
    } catch {
      // fallback: khay nhớ tạm bị chặn quyền hoặc không khả dụng, không có gì để làm thêm
    }
  };

  return (
    <button type="button" onClick={handleClick} className={className} title={title}>
      {copied ? copiedIcon : idleIcon}
    </button>
  );
}
