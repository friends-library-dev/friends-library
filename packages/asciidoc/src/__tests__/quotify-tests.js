import fs from 'fs';
import stripIndent from 'strip-indent';
import { quotify } from '../quotify';

const multilineCases = [
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
];


const fixtureCases = fs.readFileSync(`${__dirname}/fixture.adoc`)
  .toString()
  .trim()
  .split('\n\n')
  .map(pair => pair.split('\n').map(line => line.trim()));

describe('quotify()', () => {
  test.each(fixtureCases)('quotifies %s', (before, after) => {
    expect(quotify(before)).toBe(after);
  });

  test.each(multilineCases)('quotifies %s', (before, after) => {
    expect(quotify(before.replace(/\^/g, '`'))).toBe(after.replace(/\^/g, '`'));
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
