import midWordUppercase from '../mid-word-uppercase';

const opts = { lang: `en` as const };

describe(`midWordUppercase()`, () => {
  it(`creates a lint for violation of \`mid-word-uppercase\` rule`, () => {
    const results = midWordUppercase(`the paTience and faith`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 7,
      type: `error`,
      rule: `mid-word-uppercase`,
      message: `Unexpected mid-word uppercase letter (probably a scan error)`,
    });
  });

  const violations: [string][] = [
    [`power ofChrist are not`],
    [`his coming, ofFering, resurrection`],
    [`to see aDd speak`],
    [`im desirable.vFor as to his`],
    [`too often pufF up the minds`],
    [`these canS\`'see that`],
    [`His righteous laW,`],
  ];

  test.each(violations)(`\`%s\` should be a lint violation`, line => {
    const results = midWordUppercase(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`Meeting at McConnelsville, a town`],
    [`got to Uriah McMullin\`'s`],
    [`called Sir Alexander McKenzie,`],
    [`called Sir Alexander MacKenzie,`],
    [`visited Colonel McClough`],
    [`footnote:[Galatians 2:20 KJV, LitV]`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(midWordUppercase(line, [], 1, opts)).toHaveLength(0);
  });
});
