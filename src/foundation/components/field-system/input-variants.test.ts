import { describe, expect, it } from 'vitest';
import { inputVariants, resolveInputClassName } from './input-variants';

describe('inputVariants', () => {
  it('defaults to md, not invalid', () => {
    const classes = inputVariants();
    expect(classes).toContain('h-11');
    expect(classes).toContain('border-neutral-300');
    expect(classes).not.toContain('border-red-500');
  });

  it('applies lg and invalid styles, invalid border wins', () => {
    const classes = inputVariants({ size: 'lg', invalid: true });
    expect(classes).toContain('h-12');
    expect(classes).toContain('border-red-500');
    expect(classes).not.toContain('border-neutral-300');
  });

  it('merges caller className last', () => {
    expect(inputVariants({ className: 'rounded-full' })).not.toContain('rounded-xl');
  });

  it('uses real focus utilities without the unsupported custom-class opacity modifier', () => {
    const classes = inputVariants();
    expect(classes).toContain('focus-visible:outline-none');
    expect(classes).toContain('focus-visible:ring-2');
    expect(classes).toContain('focus-visible:ring-neutral-900/10');
    expect(classes).toContain('focus-visible:ring-offset-0');
    expect(classes).not.toContain('focus-ring-tight/');
    expect(inputVariants({ invalid: true })).toContain('focus-visible:ring-red-500/30');
  });
});

describe('resolveInputClassName', () => {
  it('keeps legacy className untouched when no size/invalid', () => {
    expect(resolveInputClassName({ className: 'legacy-input' })).toBe('legacy-input');
  });

  it('applies design-system styles when nothing is passed', () => {
    expect(resolveInputClassName({})).toContain('rounded-xl');
  });

  it('applies extra classes (textarea) under the caller className', () => {
    const classes = resolveInputClassName({ invalid: false }, 'h-auto min-h-24 py-2.5');
    expect(classes).toContain('min-h-24');
    expect(classes).not.toContain('h-11');
  });
});
