import bookTitleUnclosed from '../book-title-unclosed';

const opts = { lang: `en` as const };

describe(`bookTitleUnclosed()`, () => {
  it(`creates a lint for violation of \`book-title-unclosed\` rule`, () => {
    const adoc = `[.book-title]#Foo. Bar baz\n\nNew para.`;
    const lines = adoc.split(`\n`);
    const results = bookTitleUnclosed(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 14,
      type: `error`,
      rule: `book-title-unclosed`,
      message: `This book title was never closed properly with a "#"`,
    });
  });

  const violations: [string][] = [
    [`Foo [.book-title]#Bar.`],
    [`Foo [.book-title]#Bar\n\nbaz.#`], // <- crosses paragraph
    [`Foo [.book-title]#Bar.\nJim\nJam\nFoo\nBar`],
    [`Foo [.book-title]#Bar.\nBaz [.book-title]#Foo#`],
  ];

  test.each(violations)(`multiline adoc should have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(bookTitleUnclosed(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`Foo [.book-title]#Bar.#`],
    [`Foo [.book-title]#Bar.# And [.book-title]#Baz.#`],
    [`Foo [.book-title]#Bar\nBaz.#`],
    [`Foo [.book-title]#Bar\nBaz\nJim\nJam.#`],
  ];

  test.each(allowed)(`multiline adoc should not have lint error`, (adoc) => {
    const lines = adoc.split(`\n`);
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(bookTitleUnclosed(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(0);
  });
});
