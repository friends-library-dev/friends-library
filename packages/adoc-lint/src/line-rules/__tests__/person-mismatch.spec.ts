import personMismatch from '../person-mismatch';

const opts = { lang: `en`, editionType: `modernized` } as const;

describe(`personMismatch()`, () => {
  it(`creates a lint for violation of \`person-mismatch\` rule`, () => {
    const adoc = `If you sees yourself wrong,`;
    const lines = adoc.split(`\n`);
    const results = personMismatch(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 11,
      type: `error`,
      rule: `person-mismatch`,
      message: `verb/person mismatch from modernization should be fixed`,
      recommendation: `If you see yourself wrong,`,
    });
  });

  const violations: [string][] = [
    [`But if you dares not do so much`],
    [`Give, if you pleases, the salutation`],
    [`As to my bodily state, if you\npleases`],
  ];

  test.each(violations)(`multiline adoc should have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(personMismatch(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`You profess the truth`],
    [`We give you thanks, Oh Lord`],
    [`You his lambs`],
  ];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(personMismatch(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
