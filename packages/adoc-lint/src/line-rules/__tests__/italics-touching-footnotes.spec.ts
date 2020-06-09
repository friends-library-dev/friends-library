import italicsTouchingFootnote from '../italics-touching-footnote';

const opts = { lang: `en` as const };

describe(`italicsTouchingFootnote()`, () => {
  it(`creates a lint for violation of \`italics-touching-footnote\` rule`, () => {
    const results = italicsTouchingFootnote(`Foo _bar._^`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 10,
      type: `error`,
      rule: `italics-touching-footnote`,
      fixable: false,
      message: `Italics touching footnote markers must use double underscores`,
      recommendation: `Foo __bar.__^`,
    });
  });

  const violations: [string, string][] = [
    [`Foo _bar._footnote:[baz]`, `Foo __bar.__footnote:[baz]`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = italicsTouchingFootnote(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [[`Foo __bar.__^`]];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(italicsTouchingFootnote(line, [], 1, opts)).toHaveLength(0);
  });
});
