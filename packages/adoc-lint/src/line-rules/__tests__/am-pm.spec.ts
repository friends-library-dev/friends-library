import amPm from '../am-pm';

const opts = { lang: `en` as const };

describe(`amPm()`, () => {
  it(`creates a lint for violation of \`am-pm\` rule`, () => {
    const results = amPm(`Dined at 3 P.M.`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 12,
      type: `error`,
      rule: `am-pm`,
      message: `AM/PM must be formatted consistently as "a.m." and "p.m", without leading comma`,
      fixable: true,
      recommendation: `Dined at 3 p.m.`,
    });
  });

  const violations: [string, string][] = [
    [`Three p. m.`, `Three p.m.`],
    [`4 A. M.`, `4 a.m.`],
    [`8, p. m.`, `8 p.m.`],
    [`eleven A.M.`, `eleven a.m.`],
    [`at ten o clock p. m..`, `at ten o clock p.m.`],
    [`3, p.m. we arrived`, `3 p.m. we arrived`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = amPm(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [
    [`I often am very disconsolate when I consider the poor state of our society`],
    [`3 p.m. we arrived at the meetinghouse`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(amPm(line, [], 1, opts)).toHaveLength(0);
  });
});
