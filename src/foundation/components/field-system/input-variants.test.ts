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
