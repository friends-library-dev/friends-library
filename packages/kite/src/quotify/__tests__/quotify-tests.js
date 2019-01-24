import stripIndent from 'strip-indent';
import quotify from '../quotify';

const testCases = [
  [
    "got to Job Briggs',",
    "got to Job Briggs`',",
  ],
  [
    "lodged at Carlton Stokes'. That",
    "lodged at Carlton Stokes`'. That",
  ],
  [
    "Dined at Josiah Evans'. After",
    "Dined at Josiah Evans`'. After",
  ],
  [
    "when we got to David Binns', we",
    "when we got to David Binns`', we",
  ],
  [
    "Sadly, by the end of the 1800's, the Society",
    "Sadly, by the end of the 1800`'s, the Society",
  ],
  [
    "without understanding!' Fear ye not",
    "without understanding!`' Fear ye not",
  ],
  [
    "a quarter less three,'--and immediately",
    "a quarter less three,`'--and immediately",
  ],
  [
    '"`Blessed be the name of the Lord.`"\'',
    '"`Blessed be the name of the Lord.`"`\'',
  ],
  [
    'it should please the "faithful witness," in',
    'it should please the "`faithful witness,`" in',
  ],
  [
    'who cried--"Father, forgive',
    'who cried--"`Father, forgive',
  ],
  [
    'of the apostle,--"this is a faithful saying',
    'of the apostle,--"`this is a faithful saying',
  ],
  [
    'of agriculture?"--at which time a willingness',
    'of agriculture?`"--at which time a willingness',
  ],
  [
    '--"billy went to the farm',
    '--"`billy went to the farm',
  ],
  [
    "don't",
    "don`'t",
  ],
  [
    "Bob's leg hurts",
    "Bob`'s leg hurts",
  ],
  [
    '"`Foo bar.`"', // leaves already correct alone
    '"`Foo bar.`"',
  ],
  [
    'Foo bar,--"foo',
    'Foo bar,--"`foo',
  ],
  [
    '"Foo bar."',
    '"`Foo bar.`"',
  ],
  [
    'Foo "bar."',
    'Foo "`bar.`"',
  ],
  [
    'Foo "bar,"',
    'Foo "`bar,`"',
  ],
  [
    '"Foo bar."',
    '"`Foo bar.`"',
  ],
  [
    'Foo "bar."',
    'Foo "`bar.`"',
  ],
  [
    'Foo "bar,"',
    'Foo "`bar,`"',
  ],
  [
    '"Foo',
    '"`Foo',
  ],
  [
    "'Foo",
    "'`Foo",
  ],
  [
    '"Foo"',
    '"`Foo`"',
  ],
  [
    "'Foo'",
    "'`Foo`'",
  ],
  [
    strip(`
      This is a "multiline
      inline quoation" foo bar.
    `),
    strip(`
      This is a "\`multiline
      inline quoation\`" foo bar.
    `),
  ],
  [
    strip(`
      This is a 'multiline
      inline quoation' foo bar.
    `),
    strip(`
      This is a '\`multiline
      inline quoation\`' foo bar.
    `),
  ],
  [
    'Foo bar "hash baz"',
    'Foo bar "`hash baz`"',
  ],
  [
    "Foo bar 'hash baz'",
    "Foo bar '`hash baz`'",
  ],
];


describe('quotify()', () => {
  test.each(testCases)('quotifies %s', (before, after) => {
    expect(quotify(before)).toBe(after);
  });

  test('asterism not quotified', () => {
    const adoc = strip(`
      Foo bar.

      [.asterism]
      '''

      Jim jam.
    `);

    expect(quotify(adoc)).toBe(adoc);
  });

  test('bracket quotes not quotified', () => {
    const adoc = strip(`
      [#ch1.style-blurb, short="foobar"]
      == Some title

      foobar.
    `);

    expect(quotify(adoc)).toBe(adoc);
  });

  test('block quote citation not quotified', () => {
    const adoc = strip(`
      [quote, Robert Barclay, "Apology, Prop. 7, Sec. 3"]
      ____
      We therefore consider our redemption in a two-fold
      respect or state, both of which in their own nature are perfect,
      though in their application to us the one cannot be
      without respect to the other, as will be seen.
      ____
    `);

    expect(quotify(adoc)).toBe(adoc);
  });
});


function strip(str) {
  return stripIndent(str).trim();
}
