import unspacedMarkup from '../unspaced-markup';

const opts = { lang: `en` as const };

describe(`unspacedMarkup()`, () => {
  it(`creates a lint for violation of \`unspaced-markup\` rule`, () => {
    const adoc = `[.asterism]\n'''\nFoobar`;
    const lines = adoc.split(`\n`);
    const results = unspacedMarkup(lines[1], lines, 2, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: `error`,
      rule: `unspaced-markup`,
      message: `This type of markup must be followed by an empty line`,
      fixable: true,
      recommendation: `--> add an empty line after line 2`,
    });
  });

  const violations: [string, number][] = [
    [`Foo\n\n[.small-break]\n'''\nFoobar`, 3],
    [`Bar\nFoo\n\n[.asterism]\n'''\nFoobar`, 4],
  ];

  test.each(violations)(`adoc should be a violation`, (adoc, idx) => {
    const lines = adoc.split(`\n`);
    const results = unspacedMarkup(lines[idx], lines, idx + 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(`--> add an empty line after line ${idx + 1}`);
  });

  const allowed: [string, number][] = [
    [`Foo\n\n[.asterism]\n'''\n\nFoo`, 3],
    [`Foo\n\n[.small-break]\n'''\n\nFoo`, 3],
  ];

  test.each(allowed)(`adoc is not a lint violation`, (adoc, idx) => {
    const lines = adoc.split(`\n`);
    const results = unspacedMarkup(lines[idx], lines, idx + 1, opts);
    expect(results).toHaveLength(0);
  });
});
