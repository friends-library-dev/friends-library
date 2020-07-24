import initialsComma from '../initials-comma';

const opts = { lang: `en` as const };

describe(`initialsComma()`, () => {
  it(`creates a lint for violation of \`initials-comma\` rule`, () => {
    const results = initialsComma(`with S, C. to the meeting`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 7,
      type: `error`,
      rule: `initials-comma`,
      message: `unexpected comma in initials must be removed`,
      recommendation: `with S. C. to the meeting`,
      fixable: true,
    });
  });

  const violations: [string, string][] = [
    [`Came with S. C, to the meeting`, `Came with S. C., to the meeting`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = initialsComma(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [
    [`Came with S. C., and J. H., and S. G., lately returned from Russia`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(initialsComma(line, [], 1, opts)).toHaveLength(0);
  });
});
