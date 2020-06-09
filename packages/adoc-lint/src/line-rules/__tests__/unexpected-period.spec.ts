import unexpectedPeriod from '../unexpected-period';

const opts = { lang: `en` as const };

describe(`unexpectedPeriod()`, () => {
  it(`creates a lint for violation of \`unexpected-period\` rule`, () => {
    const results = unexpectedPeriod(`Then we. went to meeting`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 8,
      type: `error`,
      rule: `unexpected-period`,
      message: `Unexpected period`,
    });
  });

  const violations: [string][] = [[`Let us. seek the Lord`]];

  test.each(violations)(`\`%s\` should become "%s"`, line => {
    const results = unexpectedPeriod(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`i.e. the gift of God`],
    [`i. e. the gift of God`],
    [`i+++.+++ e. upon the king\`'s pardon.`],
    [`i+++.+++e. upon the king\`'s pardon.`],
    [`the Holy Spirit, i.e. the gift of God`],
    [`the Holy Spirit, i. e. the gift of God`],
    [`at 3 o\`/clock p. m. we went to the store`],
    [`at 3 o\`/clock P. M. we went to the store`],
    [`at 3 o\`/clock p.m. we went to the store`],
    [`at 3 o\`/clock P.M. we went to the store`],
    [`at 3 o\`/clock a. m. we went to the store`],
    [`at 3 o\`/clock A. M. we went to the store`],
    [`at 3 o\`/clock a.m. we went to the store`],
    [`at 3 o\`/clock A.M. we went to the store`],
    [`garden, etc. were in high style`],
    [`etc. were in high style`],
    [`viz. the Holy Scriptures`],
    [`Friends Library, vol. v.`],
    [`at about 2d. per lb`],
    [`costing at home perhaps 12s. is sold`],
    [`vol. ii. foo`],
    [`chap. xii. foo`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(unexpectedPeriod(line, [], 1, opts)).toHaveLength(0);
  });
});
