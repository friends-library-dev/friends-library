import unexpectedUnderscore from '../unexpected-underscore';

const opts = { lang: `en` as const };

describe(`unexpectedUnderscore()`, () => {
  it(`creates a lint for violation of \`unexpected-underscore\` rule`, () => {
    const results = unexpectedUnderscore(`And then to Ford_Green`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 17,
      type: `error`,
      rule: `unexpected-underscore`,
      message: `Unexpected underscore`,
    });
  });

  const violations: [string][] = [[`be not false to the_trust reposed`]];

  test.each(violations)(`\`%s\` should become "%s"`, line => {
    const results = unexpectedUnderscore(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`Foo_bar_ is baz.`],
    [`[#testimony_pardshaw short="short"]`],
    [`(_Foobar_)`],
    [`**_Totals:_**`],
    [`Foo bar._`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(unexpectedUnderscore(line, [], 1, opts)).toHaveLength(0);
  });
});
