import { capitalizeTitle, trimTrailingPunctuation } from '../helpers';

describe('capitalizeTitle()', () => {
  const enPairs = [
    ['foo bar', 'Foo Bar'],
    ['foo of bar', 'Foo of Bar'],
    ['of thing of', 'Of Thing Of'], // first and last should be capitalized
    ['foo and the bar of baz', 'Foo and the Bar of Baz'],
    ['man&#8217;s miserable estate', 'Man&#8217;s Miserable Estate'],
  ];

  test.each(enPairs)('it transforms (english) %s to %s', (input, expected) => {
    expect(capitalizeTitle(input, 'en')).toBe(expected);
  });

  const esPairs = [
    ['la revelación de cristo en el corazón', 'La Revelación de Cristo en el Corazón'],
    ['la muerte del alma inmortal', 'La Muerte del Alma Inmortal'],
    ['la criatura sujeta a vanidad', 'La Criatura Sujeta a Vanidad'],
  ];

  test.each(esPairs)('it transforms (spanish) %s to %s', (input, expected) => {
    expect(capitalizeTitle(input, 'es')).toBe(expected);
  });
});

describe('trimTrailingPunctuation()', () => {
  const pairs = [
    ['Foo bar.', 'Foo bar'],
    ['Foo bar, etc.', 'Foo bar, etc.'],
  ];

  test.each(pairs)('it transforms %s to %s', (input, expected) => {
    expect(trimTrailingPunctuation(input)).toBe(expected);
  });
});
