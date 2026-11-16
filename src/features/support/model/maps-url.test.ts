import { describe, expect, it } from 'vitest';
import { buildMapsDirectionsUrl } from './maps-url';

describe('buildMapsDirectionsUrl', () => {
  it('encodes the address into the Google Maps search URL', () => {
    const url = buildMapsDirectionsUrl(' Số 234 Định Công, Hà Nội ');
    expect(url).toBe(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Số 234 Định Công, Hà Nội')}`,
    );
    expect(new URL(url).searchParams.get('query')).toBe('Số 234 Định Công, Hà Nội');
  });
});
