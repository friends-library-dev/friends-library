import stripIndent from 'strip-indent';
import numberedGroup from '../numbered-group';

const opts = { lang: `en` as const };

describe(`numberedGroup()`, () => {
  it(`lints .numbered paragraph not enclosed in group`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.numbered]
      Foo bar
      and baz.

      [.numbered]
      Foo
    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: false,
      type: `error`,
      rule: `numbered-group`,
      message: `Numbered chunks must be within a [.numbered-group] block`,
    });
  });

  it(`does not lint .numbered paragraph  enclosed in group`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.numbered-group]
      ====

      [.numbered]
      Foo bar

      [.numbered]
      Foo

      ====

      Bar
    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(0);
  });
});
