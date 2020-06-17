// @ts-ignore
import myRule from '../my-slug';

const opts = { lang: `en` as const };

describe(`myRule()`, () => {
  it(`creates a lint for violation of \`my-slug\` rule`, () => {
    const results = myRule(`Some violation`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 3,
      type: `error`,
      rule: `my-slug`,
      message: `your message here`,
    });
  });

  const violations: [string, string][] = [
    // [`Violation`, `Fixed`],
  ];

  xtest.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = myRule(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [
    // [`Not a violation`],
  ];

  xtest.each(allowed)(`%s is not a lint violation`, line => {
    expect(myRule(line, [], 1, opts)).toHaveLength(0);
  });
});
