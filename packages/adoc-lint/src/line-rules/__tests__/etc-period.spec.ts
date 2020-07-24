import etcPeriod from '../etc-period';

const opts = { lang: `en` as const };

describe(`etcPeriod()`, () => {
  it(`creates a lint for violation of \`etc-period\` rule`, () => {
    const results = etcPeriod(`Foo etc bar.`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 8,
      type: `error`,
      rule: `etc-period`,
      message: `The abbreviation "etc." must always have an ending period`,
      recommendation: `Foo etc. bar.`,
      fixable: true,
    });
  });

  const violations: [string, string][] = [
    [`Foo etc; bar`, `Foo etc.; bar`],
    [`Foo etc, bar`, `Foo etc., bar`],
    [`Foo bar etc?`, `Foo bar etc.?`],
    [`Foo bar etc`, `Foo bar etc.`],
    [`Foo etc: bar`, `Foo etc.: bar`],
    [`Foo etc,; bar`, `Foo etc.; bar`],
    [`Foo etc,: bar`, `Foo etc.: bar`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = etcPeriod(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [[`Foo etc. bar`]];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(etcPeriod(line, [], 1, opts)).toHaveLength(0);
  });
});
