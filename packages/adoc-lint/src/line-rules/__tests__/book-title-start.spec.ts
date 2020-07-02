import bookTitleStart from '../book-title-start';

const opts = { lang: `en` as const };

describe(`bookTitleStart()`, () => {
  it(`creates a lint for violation of \`book-title-start\` rule`, () => {
    const results = bookTitleStart(`Foo "\`[.book-title]#Bar#`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 6,
      type: `error`,
      rule: `book-title-start`,
      message: `Only -, (, and [ chars are allowed to touch the beginning of a [.book-title]`,
    });
  });

  const violations: [string][] = [
    [`Foo I[.book-title]#Bar#`],
    [`Foo 8[.book-title]#Bar#`],
    [`Foo,[.book-title]#Bar#`],
    [`Foo [.book-title]#Bar#, baz[.book-title]#Jim#`],
  ];

  test.each(violations)(`\`%s\` is a violation of 'book-title-start' rule`, line => {
    const results = bookTitleStart(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`[.book-title]#Start of line OK#`],
    [`Foo [.book-title]#Apology#`],
    [`Foo--[.book-title]#Apology#`],
    [`Foo ([.book-title]#Apology#)`],
    [`footnote:[[.book-title]#Apology#]`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(bookTitleStart(line, [], 1, opts)).toHaveLength(0);
  });
});
