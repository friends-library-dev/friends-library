import unexpectedAsterisk from '../unexpected-asterisk';

const opts = { lang: `en` as const };

describe(`unexpectedAsterisk()`, () => {
  it(`creates a lint for violation of \`unexpected-asterisk\` rule`, () => {
    const results = unexpectedAsterisk(`Foo* bar`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 4,
      type: `error`,
      rule: `unexpected-asterisk`,
      message: `unexpected asterisk`,
      recommendation: `Foo bar`,
      fixable: false,
    });
  });

  const violations: [string, string][] = [
    [`My desire is that I may be pre*served`, `My desire is that I may be preserved`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = unexpectedAsterisk(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [
    [`* chapter synopsis list item`],
    [`| **in a table** | ** foo bar ** | baz |`],
    [`+++*+++ escaped is OK`],
    [`*rare intentional bold* is ok too`],
    [`*Foobar*--is ok too`],
    [`*Foobar,* is ok too`],
  ];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(unexpectedAsterisk(line, [], 1, opts)).toHaveLength(0);
  });
});
