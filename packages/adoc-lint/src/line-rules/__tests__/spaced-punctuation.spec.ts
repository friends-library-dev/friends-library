import spacedPunctuation from '../spaced-punctuation';

const opts = { lang: `en` as const };

describe(`spacedPunctuation()`, () => {
  it(`creates a lint for violation of \`spaced-punctuation\` rule`, () => {
    const results = spacedPunctuation(`Ah ! Alas.`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 3,
      type: `error`,
      rule: `spaced-punctuation`,
      message: `unexpected space before punctuation should be removed`,
      fixable: true,
      recommendation: `Ah! Alas.`,
    });
  });

  it(`should create multiple violations on a single line`, () => {
    const results = spacedPunctuation(`Ah ! Alas !`, [], 1, opts);
    expect(results).toHaveLength(2);
  });

  const violations: [string, string][] = [
    [`What ? Foobar`, `What? Foobar`],
    [`What , Foobar`, `What, Foobar`],
    [`What ! Foobar`, `What! Foobar`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = spacedPunctuation(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [[`[quote.scripture, , Ps. 101:1]`]];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(spacedPunctuation(line, [], 1, opts)).toHaveLength(0);
  });
});
