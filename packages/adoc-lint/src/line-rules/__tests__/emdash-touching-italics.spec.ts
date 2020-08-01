import emdashTouchingItalic from '../emdash-touching-italics';

const opts = { lang: `en` as const };

describe(`emdashTouchingItalic()`, () => {
  it(`creates a lint for violation of \`emdash-touching-italics\` rule`, () => {
    const results = emdashTouchingItalic(`Foo--_bar_`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 6,
      type: `error`,
      rule: `emdash-touching-italics`,
      recommendation: `Foo--__bar__`,
      message: `Must use double-underscore italics when preceded by double-dash (emdash)`,
    });
  });

  it(`handles emdash followed by newline`, () => {
    const results = emdashTouchingItalic(`Foo--`, [`Foo--`, `_bar_`], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      line: 2,
      column: 1,
      recommendation: `__bar__`,
    });
  });

  const violations: [string, string, number][] = [
    [`Foo--\n_bar_`, `__bar__`, 1],
    [`== C1\n\nFoo--_bar_.\nBeep--\n_boop_ baz.`, `Foo--__bar__.`, 2],
  ];

  test.each(violations)(
    `multiline adoc should have lint error`,
    (adoc, firstReco, numViolations) => {
      const lines = adoc.split(`\n`);
      let results: any[] = [];
      lines.forEach((line, i) => {
        results = results.concat(emdashTouchingItalic(line, lines, i + 1, opts));
      });
      expect(results).toHaveLength(numViolations);
      expect(results[0].recommendation).toBe(firstReco);
    },
  );

  const allowed: [string][] = [[`Foo--__bar__`], [`Foo\n__bar__`]];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(emdashTouchingItalic(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
