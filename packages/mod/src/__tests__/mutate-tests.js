import { mutateLine } from '../mutate';

describe('mutateLine()', () => {
  const cases = [
    [
      'Foo thou bar',
      'Foo you bar',
      [{ start: 4, end: 8, replace: 'you' }],
    ],

    [
      'Foo thou bar',
      'Foo LOL bar',
      [{ start: 4, end: 8, replace: 'LOL' }],
    ],

    [
      'Foo thou bar',
      'Foo bar',
      [{ start: 4, end: 8, replace: '' }],
    ],
  ];

  test.each(cases)('"%s" becomes "%s"', (line, expected, mutations) => {
    const mutated = mutateLine(line, mutations);

    expect(mutated).toBe(expected);
  });
});
