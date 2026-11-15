// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AutocompleteSearch } from './autocomplete-search';

const mocks = vi.hoisted(() => ({ push: vi.fn(), suggestions: [
  { id: '1', slug: 'bong', name: 'Bóng bàn', imageUrl: null, priceLabel: '100.000 ₫', categoryLabel: 'Bóng bàn' },
] }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: mocks.push }) }));
vi.mock('@/features/catalog', () => ({ useProductSearch: () => ({ suggestions: mocks.suggestions, isPending: false, isError: false }) }));
vi.mock('next/dynamic', async () => {
  const { SuggestionPopover } = await import('./suggestion-popover');
  return { default: () => SuggestionPopover };
});
describe('Autocomplete ARIA', () => {
  afterEach(cleanup);
  it('does not reuse listbox/option IDs when desktop and mobile searches coexist', async () => {
    render(<><AutocompleteSearch /><AutocompleteSearch /></>);
    const inputs = screen.getAllByRole('combobox');
    for (const input of inputs) {
      fireEvent.change(input, { target: { value: 'bóng' } });
    }
    await waitFor(() => expect(screen.getAllByRole('listbox')).toHaveLength(2));
    const ids = screen.getAllByRole('listbox').map((list) => list.id);
    expect(new Set(ids).size).toBe(2);
    inputs.forEach((input, index) => {
      expect(input.getAttribute('aria-controls')).toBe(ids[index]);
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      const selected = document.getElementById(input.getAttribute('aria-activedescendant')!);
      expect(selected?.getAttribute('role')).toBe('option');
      expect(document.getElementById(ids[index])?.contains(selected)).toBe(true);
    });
  });
  it('focuses mobile search and lets Escape close it even with no query/results', () => {
    const close = vi.fn();
    render(<AutocompleteSearch isMobile onCloseMobile={close} />);
    const input = screen.getByRole('combobox');
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(close).toHaveBeenCalledOnce();
  });
});
