import danglingPossessive from '../dangling-possessive';

const opts = { lang: `en` as const };

describe(`danglingPossessive()`, () => {
  it(`creates a lint for violation of \`dangling-possessive\` rule`, () => {
    const adoc = `end of Christ\`'\ns coming`;
    const lines = adoc.split(`\n`);
    const results = danglingPossessive(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 16,
      type: `error`,
      rule: `dangling-possessive`,
      message: `Possessive broken over two lines (probably by conversion process)`,
      recommendation: `end of Christ\`'s\ncoming`,
      fixable: true,
    });
  });

  const violations: [string, string][] = [
    [`that she\`'\ns been good`, `that she\`'s\nbeen good`],
  ];

  test.each(violations)(`multiline adoc should have lint error`, (adoc, fixed) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(danglingPossessive(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(fixed);
  });

  const allowed: [string][] = [[`'\`A single quote\`'\nsomething after`]];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(danglingPossessive(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
