import { describe, expect, it } from 'vitest';
import { buttonVariants } from './button-variants';

describe('buttonVariants', () => {
  it('defaults to primary + md', () => {
    const classes = buttonVariants();
    // Nút chính màu than, không còn gradient đỏ (đỏ chỉ cho giá/khuyến mãi và huỷ/xoá).
    expect(classes).not.toMatch(/from-red|bg-red/);
    expect(classes).toContain('bg-neutral-900');
    expect(classes).toContain('h-11');
    expect(classes).not.toContain('w-full');
  });

  it('applies variant, size and fullWidth', () => {
    const classes = buttonVariants({ variant: 'outline', size: 'lg', fullWidth: true });
    expect(classes).toContain('border-neutral-300');
    expect(classes).toContain('h-12');
    expect(classes).toContain('w-full');
    expect(classes).not.toContain('bg-neutral-900');
  });

  it('lets className override conflicting utilities', () => {
    const classes = buttonVariants({ variant: 'primary', className: 'bg-neutral-500 rounded-full' });
    expect(classes).toContain('bg-neutral-500');
    expect(classes).toContain('rounded-full');
    expect(classes).not.toContain('rounded-xl');
  });
});
