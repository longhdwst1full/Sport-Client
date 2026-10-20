import { describe, expect, it } from 'vitest';
import { buttonVariants } from './button-variants';

describe('buttonVariants', () => {
  it('mặc định primary + md: màu qua token vai trò, không viết thẳng mã màu', () => {
    const classes = buttonVariants();
    expect(classes).toContain('bg-action');
    expect(classes).toContain('text-on-action');
    expect(classes).toContain('h-11');
    expect(classes).not.toMatch(/bg-(brand|neutral|red)-\d/);
    expect(classes).not.toContain('w-full');
  });

  it('secondary + lg + fullWidth', () => {
    const classes = buttonVariants({ variant: 'secondary', size: 'lg', fullWidth: true });
    expect(classes).toContain('border-control-border');
    expect(classes).toContain('h-12');
    expect(classes).toContain('w-full');
    expect(classes).not.toContain('bg-action');
  });

  it('disabled một kiểu chung, nút chữ không có nền khi disabled', () => {
    expect(buttonVariants()).toContain('disabled:bg-control-disabled');
    expect(buttonVariants({ variant: 'link' })).toContain('disabled:bg-transparent');
  });

  it('className vẫn ghi đè được utility bố cục', () => {
    const classes = buttonVariants({ variant: 'primary', className: 'rounded-full px-8' });
    expect(classes).toContain('rounded-full');
    expect(classes).not.toContain('rounded-2xl');
  });
});
