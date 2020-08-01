import bookTitleSpacing from '../book-title-spacing';

const opts = { lang: `en` as const };

describe(`bookTitleSpacing()`, () => {
  it(`creates a lint for violation of \`book-title-spacing\` rule`, () => {
    const results = bookTitleSpacing(`Foo [.book-title]# Bar#`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 19,
      type: `error`,
      rule: `book-title-spacing`,
      message: `Improper spacing around [.book-title]`,
      fixable: true,
      recommendation: `Foo [.book-title]#Bar#`,
    });
  });

  it(`lints more than one violation per line`, () => {
    const line = `[.book-title]# Bar#, [.book-title]# Baz#`;
    const results = bookTitleSpacing(line, [], 1, opts);
    expect(results).toHaveLength(2);
  });

  const violations: [string, string | false][] = [
    [`[.book-title]#  Apology#`, `[.book-title]#Apology#`],
    [`[.book-title]#   Apology#`, `[.book-title]#Apology#`],
    [`[.book-title]#`, false],
  ];

  test.each(violations)(`\`%s\` is a violation of 'book-title-spacing'`, (line, reco) => {
    const results = bookTitleSpacing(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].fixable).toBe(!!reco);
    if (reco) {
      expect(results[0].recommendation).toBe(reco);
    } else {
      expect(results[0].recommendation).toBeUndefined();
    }
  });

  const allowed: [string][] = [
    [`[.book-title]#Apology#`],
    [`[.book-title]#Barclays Apology#`],
  ];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(bookTitleSpacing(line, [], 1, opts)).toHaveLength(0);
  });
});
