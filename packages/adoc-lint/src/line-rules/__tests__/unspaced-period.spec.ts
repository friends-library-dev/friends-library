import unspacedPeriod from '../unspaced-period';

const opts = { lang: `en` as const };

describe(`unspacedPeriod()`, () => {
  it(`creates a lint for violation of \`unspaced-period\` rule`, () => {
    const results = unspacedPeriod(`me a people.And they shall not`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 12,
      type: `error`,
      rule: `unspaced-period`,
      message: `unexpected unspaced period`,
    });
  });

  const violations: [string][] = [
    [`than in show.I went to visit`],
    [`Quarterly Meeting.Being two days`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, line => {
    const results = unspacedPeriod(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [[`friend T.E. (the bearer of this letter)`]];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(unspacedPeriod(line, [], 1, opts)).toHaveLength(0);
  });
});
