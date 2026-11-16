import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AccountPageMain, type AccountPageMainWidth } from './account-page-main';

describe('AccountPageMain', () => {
  it.each(['xl', '3xl', '4xl', '5xl', '6xl'] as AccountPageMainWidth[])('renders width %s', (width) => {
    expect(renderToStaticMarkup(<AccountPageMain width={width}>x</AccountPageMain>)).toBe(
      `<main class="mx-auto min-h-[60vh] max-w-${width} px-4 py-10 sm:px-6">x</main>`,
    );
  });
});
