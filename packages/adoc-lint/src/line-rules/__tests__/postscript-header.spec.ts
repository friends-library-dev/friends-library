import postscriptHeader from '../postscript-header';

const opts = { lang: `en` as const };

describe(`postscriptHeader()`, () => {
  it(`creates a lint for violation of \`postscript-header\` rule`, () => {
    const results = postscriptHeader(`Postscript:`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: false,
      type: `error`,
      rule: `postscript-header`,
      message: `Postscript "headers" are not allowed`,
      recommendation: `Add \`Postscript.--\` to start of postscript body`,
      fixable: false,
    });
  });

  const violations: [string][] = [
    [`POSTSCRIPT`],
    [`POSTSCRIPT.`],
    [`Postscript:`],
    [`Postscript`],
  ];

  test.each(violations)(`\`%s\` is a lint violation`, (line) => {
    const results = postscriptHeader(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [[`Postscript: Foo bar.`], [`[.postscript]`]];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(postscriptHeader(line, [], 1, opts)).toHaveLength(0);
  });
});
