import { describe, expect, it } from 'vitest';
import { buttonVariants } from './button-variants';

describe('buttonVariants', () => {
  it('defaults to primary + md', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-slate-900');
    expect(classes).toContain('h-11');
    expect(classes).not.toContain('w-full');
  });

  it('applies variant, size and fullWidth', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true });
    expect(classes).toContain('border-slate-300');
    expect(classes).toContain('h-12');
    expect(classes).toContain('w-full');
    expect(classes).not.toContain('bg-slate-900');
  });

  it('lets className override conflicting utilities', () => {
    const classes = buttonVariants({ variant: 'primary', className: 'bg-slate-500 rounded-full' });
    expect(classes).toContain('bg-slate-500');
    expect(classes).not.toContain('bg-slate-900');
    expect(classes).toContain('rounded-full');
    expect(classes).not.toContain('rounded-xl');
  });
});
