import { capitalizeTitle, wrapper, trimTrailingPeriod } from '../text';

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


describe('wrapper()', () => {
  it('returns a reducer function that wraps arrays of strings', () => {
    const wrapped = ['Thomas'].reduce(wrapper('Jared', 'Henderson'), []);

    expect(wrapped).toEqual(['Jared', 'Thomas', 'Henderson']);
  });
});

describe('trimTrailingPeriod()', () => {
  const pairs = [
    ['Foo bar.', 'Foo bar'],
    ['Foo bar, etc.', 'Foo bar, etc.'],
  ];

  test.each(pairs)('it transforms %s to %s', (input, expected) => {
    expect(trimTrailingPeriod(input)).toBe(expected);
  });
});
