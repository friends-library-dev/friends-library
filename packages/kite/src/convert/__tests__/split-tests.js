import { makeSplitLines, splitLines } from '../split';

const splitShort = makeSplitLines(32, 10);

describe('splitShort()', () => {
  const cases = [
    ['Foo.\nBar', 'Foo. Bar'],
    ['Foo.\n\nBar', 'Foo.\n\nBar'],
    ['It was M. P. Neale.\nFoo.', 'It was M. P. Neale. Foo.'],
    ['It also will split;\non semicolons', 'It also will split; on semicolons'],
    ['End with exclamation!\nFoo', 'End with exclamation! Foo'],
    ['but alas! how few', 'but alas! how few'], // ! does not end sentence
    ['Foo^\nfootnote:[foobar.]\nbaz.', 'Foofootnote:[foobar.] baz.'],
  ];

  test.each(cases)('should return %s when splitting %s', (expected, input) => {
    expect(splitShort(input)).toBe(expected);
  });

  it('should not split on viz.', () => {
    const sentence = 'A rabbit, viz. a hare.';

    expect(splitLines(sentence)).toBe(sentence);
  });

  it('should not split on etc. in sentence', () => {
    const sentence = 'A rabbit, etc. and a bug.';

    expect(splitLines(sentence)).toBe(sentence);
  });

  it('should split on etc. at the end of sentence', () => {
    const sentence = 'A rabbit, etc. Then a bug...';

    expect(splitLines(sentence)).toBe('A rabbit, etc.\nThen a bug...');
  });

  it('should split on sentences ending with quotations', () => {
    const sentence = 'A quote follow "`Foo is bar.`" And hello sir.';

    const result = splitShort(sentence);

    expect(result).toBe('A quote follow "`Foo is bar.`"\nAnd hello sir.');
  });

  it('should split long sentences', () => {
    const sentence = 'This is a really long sentence, should be split at comma.';

    const result = splitShort(sentence);

    expect(result).toBe('This is a really long sentence,\nshould be split at comma.');
  });

  it('should not split headings', () => {
    const input = '= This is a really long heading, but should not be split.';

    expect(splitShort(input)).toBe(input);
  });

  it('should observe min-length when sub-splitting sentences', () => {
    const input = 'Foo, bar, one two three four five.';

    const result = splitShort(input);

    expect(result).toBe('Foo, bar,\none two three four five.');
  });

  it('if it must, it will split between a random word approximately in the middle', () => {
    const input = 'Foo bar baz one two three four five six seven.';

    const result = splitShort(input);

    expect(result).toBe('Foo bar baz one two three\nfour five six seven.');
  });

  it('works so good', () => {
    const input = 'Hast thou, in the metaphorical language of Scripture, opened the door of the heart unto him, when, by the secret convictions of his Holy Light or Spirit, he has knocked there for admission?';

    const result = splitLines(input);

    expect(result).toBe('Hast thou, in the metaphorical language of Scripture,\nopened the door of the heart unto him, when,\nby the secret convictions of his Holy Light or Spirit,\nhe has knocked there for admission?');
  });

  it('does not put ^Oh,$ as whole line', () => {
    const input = 'Ninth Month.--Our Yearly Meeting is past. Oh, who could have thought that our Society would have ever exhibited the aspect that it now does.';

    const result = splitLines(input);

    expect(result).not.toContain('\nOh,\n');
  });

  it('does not put ^Lord,$ as whole line', () => {
    const input = 'Lord, thou knowest for what thou permittest me to experience the cloud to rest upon the tabernacle.';

    const result = splitLines(input);

    expect(result).not.toContain('Lord,\n');
  });

  it('can handle sentences ending with very short words (see "on.")', () => {
    const input = 'When this meeting ended I felt calm and peaceful. Oh, the superficial daubing which it seems to me is going on. My heart feels sometimes to sicken under a consideration of these things.';

    const result = splitLines(input);

    expect(result).not.toContain('on. My');
  });

  it('does not split in the middle of double-dash', () => {
    const input = 'Foo bar baz one two three--four five six seven.';

    const result = splitShort(input);

    expect(result).not.toMatch(/three-\n/);
  });

  it('understands sentences ending with 4-digit years', () => {
    const input = 'Foobar, hash baz, 1842. We went about a half a mile.';

    const result = splitShort(input);

    expect(result).not.toMatch(/1842\. /);
  });

  it('does not put etc. on its own line', () => {
    const input = 'In the spring of that year he spread his prospect before his friends, and in the 5th month he obtained a certificate from the yearly meeting of New York to Friends in Great Britain, etc. He felt his mind drawn to pay another visit to New England, and then embark from there to Halifax or Liverpool, as way might open.';

    const result = splitLines(input);

    expect(result).not.toMatch(/\netc\.\n/);
  });
});
