import unwrappedPostscript from '../unwrapped-postscript';

const opts = { lang: `en` as const };

describe(`unwrappedPostscript()`, () => {
  it(`creates a lint for violation of \`unwrapped-postscript\` rule`, () => {
    const adoc = `[.postscript]\nFoo bar.`;
    const lines = adoc.split(`\n`);
    const results = unwrappedPostscript(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: false,
      type: `error`,
      rule: `unwrapped-postscript`,
      message: `Postscripts must be wrapped in blocks with \`====\` delimiters`,
    });
  });

  const violations = [[`[.postscript.emphasized]\nFoo bar.`]];

  test.each(violations)(`multiline adoc should have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(unwrappedPostscript(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
  });

  const allowed = [[`[.postscript]\n====\n\nFoo bar\n\n====\n\n`]];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(unwrappedPostscript(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
