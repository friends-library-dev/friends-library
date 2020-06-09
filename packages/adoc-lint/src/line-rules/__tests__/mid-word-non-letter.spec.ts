import midWordNonLetter from '../mid-word-non-letter';

const opts = { lang: `en` as const };

describe(`midWordNonLetter()`, () => {
  it(`creates a lint for violation of \`mid-word-non-letter\` rule`, () => {
    const results = midWordNonLetter(`She w&s sober-minded`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 6,
      type: `error`,
      rule: `mid-word-non-letter`,
      message: `Unexpected mid-word non-letter (probably a scan error)`,
    });
  });

  const violations: [string][] = [
    [`to be in*structed`],
    [`Foo b=r`],
    [`To the meeting} we went`],
  ];

  test.each(violations)(`\`%s\` is a lint violation`, line => {
    const results = midWordNonLetter(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`Foo bar&hellip; baz`],
    [`{footnote-paragraph-split}`],
    [`[#ch1, short="foo"]`],
    [`See [.book-title] #Primitive Christianity#`],
    [`Catherine [Payton] Phillips`],
    [`Foo *bar* `],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(midWordNonLetter(line, [], 1, opts)).toHaveLength(0);
  });
});
