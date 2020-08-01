import titleLength from '../title-length';

const opts = { lang: `en` as const };

const FIFTY_CHARS = `The Authority and Government that Christ Excluded`;

describe(`titleLength()`, () => {
  it(`creates a lint for violation of \`title-length\` rule`, () => {
    const adoc = `== ${FIFTY_CHARS} and Some More Stuff After`;
    const lines = adoc.split(`\n`);
    const results = titleLength(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 4,
      type: `error`,
      rule: `title-length`,
      message: `long chapter titles need a hand-crafted short title for table of contents and running headers`,
    });
  });

  const violations: [string][] = [[`== ${FIFTY_CHARS} with So Much More`]];

  test.each(violations)(`multiline adoc should have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(titleLength(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`[#ch1, short="So Short"]\n== ${FIFTY_CHARS} ${FIFTY_CHARS}`],
    [`== ${FIFTY_CHARS} / This Stuff after Slash Doesn’t Count Against Length`],
    [`== Chapter 13. ${FIFTY_CHARS}`],
    [`== Capítulo XXIV. ${FIFTY_CHARS}`],
    [`== Sección I. ${FIFTY_CHARS}`],
    [`== Section 4. ${FIFTY_CHARS}`],
  ];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(titleLength(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
