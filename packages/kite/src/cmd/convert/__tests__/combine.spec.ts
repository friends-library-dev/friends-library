import { combineLines } from '../combine';

describe('combineLines', () => {
  const cases = [
    ['Foo. Bar', 'Foo.\nBar'],
    ['Foo.\n\nBar.', 'Foo.\n\nBar.'],
    ['Foo, Bar', 'Foo,\nBar'],
    ['Foo,\n\nBar', 'Foo,\n\nBar'],
    ['(Matt. xvii. 20)', '(Matt.\nxvii.\n20)'],
  ];

  test.each(cases)('should return %s when melding %s', (expected, input) => {
    expect(combineLines(input)).toBe(expected);
  });
});
