import { capitalizeTitle, makeReduceWrapper, trimTrailingPunctuation } from '../helpers';

describe('capitalizeTitle()', () => {
  const pairs = [
    ['foo bar', 'Foo Bar'],
    ['foo of bar', 'Foo of Bar'],
    ['of thing of', 'Of Thing Of'], // first and last should be capitalized
    ['foo and the bar of baz', 'Foo and the Bar of Baz'],
    ['man&#8217;s miserable estate', 'Man&#8217;s Miserable Estate'],
  ];

  test.each(pairs)('it transforms %s to %s', (input, expected) => {
    expect(capitalizeTitle(input)).toBe(expected);
  });
});

describe('makeReduceWrapper()', () => {
  it('returns a reducer function that wraps arrays of strings', () => {
    const wrapped = ['Thomas'].reduce(makeReduceWrapper('Jared', 'Henderson'), []);

    expect(wrapped).toEqual(['Jared', 'Thomas', 'Henderson']);
  });
});

describe('trimTrailingPunctuation()', () => {
  const pairs = [['Foo bar.', 'Foo bar'], ['Foo bar, etc.', 'Foo bar, etc.']];

  test.each(pairs)('it transforms %s to %s', (input, expected) => {
    expect(trimTrailingPunctuation(input)).toBe(expected);
  });
});
