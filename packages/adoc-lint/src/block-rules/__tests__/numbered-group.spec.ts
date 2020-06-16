import stripIndent from 'strip-indent';
import numberedGroup from '../numbered-group';

const opts = { lang: `en` as const };

describe(`numberedGroup() - missing-surrounding-space`, () => {
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

  it(`lints unclosed .numbered-group`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.numbered-group]
      ====

      [.numbered]
      Foo bar
      and baz.

    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: false,
      type: `error`,
      rule: `numbered-group`,
      message: `This block was never terminated with a \`====\` line.`,
    });
  });

  it(`lints unclosed .numbered-group, with a following group`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.numbered-group]
      ====

      [.numbered]
      Foo bar

      [.numbered-group]
      ====

      [.numbered]
      Foo bar
      
      ====

      Foo
    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: false,
      type: `error`,
      rule: `numbered-group`,
      message: `This block was never terminated with a \`====\` line.`,
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

  it(`lints numbered-group delimiters not surrounded by empty lines`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.numbered-group]
      ====

      [.numbered]
      Foo bar
      and baz.
      ====
      Foobar

    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 9,
      column: false,
      type: `error`,
      rule: `numbered-group`,
      message: `Numbered-group delimiters must be surrounded by blank lines`,
      fixable: true,
      recommendation: `--> insert blank line before and after line 9`,
    });
  });

  it(`lints numbered-group termination without opening`, () => {
    const adoc = stripIndent(`
      Foo bar.

      ====

      Foo bar.
    `).trim();

    const results = numberedGroup(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: false,
      type: `error`,
      rule: `numbered-group`,
      message: `Unexpected [.numbered-group] terminating delimiter`,
    });
  });
});
