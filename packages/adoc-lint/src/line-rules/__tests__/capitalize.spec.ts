import capitalize from '../capitalize';

const opts = { lang: `en` as const };

describe(`capitalize()`, () => {
  it(`creates a lint for violation of \`capitalize\` rule`, () => {
    const results = capitalize(`Wiles of satan`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 10,
      type: `error`,
      rule: `capitalize`,
      message: `"Satan" should be capitalized everywhere in all editions`,
      recommendation: `Wiles of Satan`,
      fixable: true,
    });
  });

  const violations = [[`Foo satan,`, `Foo Satan,`]];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = capitalize(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [[`Satan foo`]];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(capitalize(line, [], 1, opts)).toHaveLength(0);
  });
});
