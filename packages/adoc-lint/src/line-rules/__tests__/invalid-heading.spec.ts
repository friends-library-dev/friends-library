import invalidHeading from '../invalid-heading';

const opts = { lang: `en` as const };

describe(`invalidHeading()`, () => {
  it(`creates a lint violation result for a line with invalid heading`, () => {
    const results = invalidHeading(`= No beuno`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 1,
      type: `error`,
      rule: `invalid-heading`,
      message: `Headings may only have 2-4 equal signs, and must be followed by a space and at least one character`,
      fixable: false,
    });
  });

  test(`extra spaces is fixable`, () => {
    const results = invalidHeading(`==  No beuno`, [], 1, opts);
    expect(results[0]).toMatchObject({
      fixable: true,
      recommendation: `== No beuno`,
    });
  });

  const violations = [
    [`= Foo`],
    [`===== Foo`],
    [`====== Foo`],
    [`==Foo`],
    [`===Foo`],
    [`====Foo`],
    [`========`],
    [`==`],
    [`=== `],
  ];

  test.each(violations)(`%s should be a lint violation`, line => {
    const results = invalidHeading(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed = [
    [`== Foo`],
    [`=== Foo`],
    [`==== Foo`],
    [`=== Foo Bar`],
    [`==== 1 Thing`],
    [`=======`], // will be caught by `git-conflict-markers`
    [`// salad = yummy`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(invalidHeading(line, [], 1, opts)).toHaveLength(0);
  });
});
