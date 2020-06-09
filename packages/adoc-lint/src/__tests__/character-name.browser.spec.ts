// @ts-check
import characterName from '../character-name.browser';

describe(`characterName()`, () => {
  // prettier-ignore
  const cases = [
    [` `, `NO-BREAK SPACE`],
    [`–`, `EN DASH`],
    [`О`, `CYRILLIC CAPITAL LETTER O`],
    [`•`, `BULLET`],
    [`“`, `LEFT DOUBLE QUOTATION MARK`],
    [`”`, `RIGHT DOUBLE QUOTATION MARK`],
    [`‘`, `LEFT SINGLE QUOTATION MARK`],
    [`’`, `RIGHT SINGLE QUOTATION MARK`],
  ];

  test.each(cases)(`%s should return %s`, (input, expected) => {
    expect(characterName(input)).toBe(expected);
  });

  test(`knows soft-hyphen`, () => {
    expect(characterName(`be­stowed`[2])).toBe(`SOFT HYPHEN`);
  });
});
