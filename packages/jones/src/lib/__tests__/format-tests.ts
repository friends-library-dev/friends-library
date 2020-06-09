import { italicize, Range } from '../format';

const cases: [string, string, string, Range, string][] = [
  [
    `Foo`,
    `Foo bar`,
    `Foo bar`,
    { start: { row: 0, column: 0 }, end: { row: 0, column: 3 } },
    `_Foo_`,
  ],
  [
    `oo`,
    `Foobar`,
    `Foobar`,
    { start: { row: 0, column: 1 }, end: { row: 0, column: 3 } },
    `__oo__`,
  ],
  [
    `bar.`,
    `Foo bar.^`,
    `Foo bar.^`,
    { start: { row: 0, column: 4 }, end: { row: 0, column: 8 } },
    `__bar.__`,
  ],
  [
    `so\nhash`,
    `Foobar so`,
    `hash baz.`,
    { start: { row: 0, column: 7 }, end: { row: 1, column: 4 } },
    `_so\nhash_`,
  ],
  [
    `so\nha`,
    `Foobar so`,
    `hash baz.`,
    { start: { row: 0, column: 7 }, end: { row: 1, column: 2 } },
    `__so\nha__`,
  ],
  [
    `Foobar.`,
    `+++[+++Foobar.]`,
    `+++[+++Foobar.]`,
    { start: { row: 0, column: 7 }, end: { row: 0, column: 14 } },
    `_Foobar._`,
  ],
  [
    `Bar`,
    `Foo:--"\`Bar baz\`"`,
    `Foo:--"\`Bar baz\`"`,
    { start: { row: 0, column: 8 }, end: { row: 0, column: 11 } },
    `__Bar__`,
  ],
];

describe(`italicize`, () => {
  test.each(cases)(`italicizing "%s" in "%s"`, (sel, first, last, range, expected) => {
    expect(italicize(sel, first, last, range)).toBe(expected);
  });
});
