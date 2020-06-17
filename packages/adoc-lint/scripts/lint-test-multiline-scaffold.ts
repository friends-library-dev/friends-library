// @ts-ignore
import myRule from '../my-slug';

const opts = { lang: `en` as const };

describe(`myRule()`, () => {
  it(`creates a lint for violation of \`my-slug\` rule`, () => {
    const adoc = `Multiline\nasciidoc`;
    const lines = adoc.split(`\n`);
    const results = myRule(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 1,
      type: `error`,
      rule: `my-slug`,
      message: `your message here`,
    });
  });

  const violations: [string, string][] = [
    // [`Violation`, `Fixed`],
  ];

  xtest.each(violations)(`multiline adoc should have lint error`, (adoc, fixed) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(myRule(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(fixed);
  });

  const allowed: [string][] = [
    // [`Not a violation`],
  ];

  xtest.each(allowed)(`multiline adoc should not have lint error`, adoc => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(myRule(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
