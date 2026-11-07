import { describe, expect, it } from 'vitest';
import { freeShippingProgress } from './free-shipping';

describe('freeShippingProgress', () => {
  it('is disabled when the threshold is 0 or invalid', () => {
    expect(freeShippingProgress(9_000_000, 0)).toEqual({ enabled: false });
    expect(freeShippingProgress(9_000_000, Number.NaN)).toEqual({ enabled: false });
  });

  it('reports the remaining amount below the threshold', () => {
    expect(freeShippingProgress(3_500_000, 5_000_000)).toEqual({
      enabled: true, threshold: 5_000_000, reached: false, remaining: 1_500_000, percent: 70,
    });
  });

  it('is reached exactly at and above the threshold', () => {
    expect(freeShippingProgress(5_000_000, 5_000_000)).toMatchObject({ reached: true, remaining: 0, percent: 100 });
    expect(freeShippingProgress(7_200_000, 5_000_000)).toMatchObject({ reached: true, remaining: 0, percent: 100 });
  });
});
