import { feeOffset } from '../stripe';

describe('feeOffset()', () => {
  it('throws if passed a non-integer', () => {
    expect(() => feeOffset(33.34)).toThrow();
  });

  const cases = [
    [455, 45],
    [1135, 65],
    [1426, 74],
    [1912, 88],
    [726, 53],
    [13945, 447],
    [4823, 175],
    [24550, 764],
    [41917, 1283],
  ];

  test.each(cases)('offset for %d should be %d', () => {
    expect(feeOffset(941)).toBe(59);
  });
});
