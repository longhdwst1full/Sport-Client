// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { MegaMenuEntry } from '@/features/catalog';
import { DesktopMegaMenu } from './desktop-mega-menu';
import { HeaderActions } from './header-actions';

const category: MegaMenuEntry = { slug: 'gym', label: 'Tập gym', href: '/category/gym', imageUrl: null, productCount: 1,
  children: [{ slug: 'ta', label: 'Tạ tay', href: '/category/ta', productCount: 1 }] };
describe('Header disclosure accessibility', () => {
  afterEach(cleanup);
  it('connects expanded trigger with its panel and Escape from a child stays closed', () => {
    render(<DesktopMegaMenu megaMenuCategories={[category]} hasFlashSaleCampaign={false} flashSaleMaxDiscountPercent={null} />);
    const trigger = screen.getByRole('link', { name: 'Tập gym' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.focus();
    fireEvent.focus(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)).not.toBeNull();
    const child = screen.getByRole('link', { name: 'Tạ tay' });
    child.focus();
    fireEvent.keyDown(child, { key: 'Escape' });
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('link', { name: 'Tạ tay' })).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
  it('exposes the mobile search toggle state and controlled panel', () => {
    const toggle = vi.fn();
    render(<><HeaderActions searchOpen onToggleSearch={toggle} isLoggedIn={false} customerName="" cartQuantity={0} mobileMenuOpen={false} onToggleMobileMenu={vi.fn()} /><div id="mobile-search-panel" /></>);
    const trigger = screen.getByRole('button', { name: 'Tìm sản phẩm' });
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById(trigger.getAttribute('aria-controls')!)).not.toBeNull();
    fireEvent.click(trigger);
    expect(toggle).toHaveBeenCalledOnce();
  });
});
