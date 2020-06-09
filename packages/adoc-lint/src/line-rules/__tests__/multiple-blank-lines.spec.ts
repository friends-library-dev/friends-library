import stripIndent from 'strip-indent';
import multipleBlankLines from '../multiple-blank-lines';

const opts = { lang: `en` as const };

describe(`multipleBlankLines()`, () => {
  it(`creates a lint violation result for a line with multiple blank lines`, () => {
    const adoc = stripIndent(`
      == Chapter 1


      Foobar.
    `).trim();
    const lines = adoc.split(`\n`);
    const results = multipleBlankLines(lines[2], lines, 3, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: `error`,
      rule: `multiple-blank-lines`,
      message: `Multiple blank lines are not allowed`,
      fixable: true,
      recommendation: `--> remove line/s: (2)`,
    });
  });

  it(`only flags the last line`, () => {
    const adoc = stripIndent(`
      == Chapter 1




      Foobar.
    `).trim();
    const lines = adoc.split(`\n`);
    lines.forEach((line, index) => {
      const results = multipleBlankLines(line, lines, index + 1, opts);
      if (index === 4) {
        expect(results).toHaveLength(1);
        expect(results[0].recommendation).toBe(`--> remove line/s: (2,3,4)`);
      } else {
        expect(results).toHaveLength(0);
      }
    });
  });
});
