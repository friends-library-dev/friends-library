import unintentionalListItem from '../unintentional-list-item';

const opts = { lang: `en` as const };

describe(`unintentionalListItem()`, () => {
  it(`creates a lint violation result for a line with trailing whitespace`, () => {
    const results = unintentionalListItem(`T. Story came for lunch.`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 2,
      type: `error`,
      rule: `unintentional-list-item`,
      message: `Periods near the beginning of the line sometimes need to be escaped to prevent errors converting to HTML.`,
      recommendation: `T+++.+++ Story came for lunch.`,
    });
  });

  const violations = [
    [`R. Jones`, `R+++.+++ Jones`],
    [`1772. Went to`, `1772+++.+++ Went to`],
    [`72. Went to`, `72+++.+++ Went to`],
    [`. Foo`, `+++.+++ Foo`],
  ];

  test.each(violations)(`%s should be %s`, (line, reco) => {
    const results = unintentionalListItem(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [[`Mr. Foo came`], [`1772 was a good year`]];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(unintentionalListItem(line, [], 1, opts)).toHaveLength(0);
  });
});
