import stripIndent from 'strip-indent';
import wrappingBlocks from '../wrapping-block';

const opts = { lang: `en` as const };

describe(`wrappingBlocks()`, () => {
  it(`lints closing terminator without proper spacing before`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.postscript]
      ====

      Foo bar
      and baz.
      ====

      Foo
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 8,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping block delimiters must be surrounded by empty lines`,
      recommendation: `--> add an empty line before line 8`,
      fixable: true,
    });
  });

  it(`lints closing terminator without proper spacing after`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.postscript]
      ====

      Foo bar
      and baz.

      ====
      Foo
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 10,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping block delimiters must be surrounded by empty lines`,
      recommendation: `--> add an empty line before line 10`,
      fixable: true,
    });
  });

  it(`lints opening terminator without proper spacing after`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.postscript]
      ====
      Foo bar
      and baz.

      ====

      Foo
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 5,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping block delimiters must be surrounded by empty lines`,
      recommendation: `--> add an empty line before line 5`,
      fixable: true,
    });
  });
});

describe(`wrappingBlocks() - unlabeled-wrapping-block-delimiter`, () => {
  it(`lints the opening of a block with no class label`, () => {
    const adoc = stripIndent(`
      Foo bar.

      ====

      Foo bar
      and baz.

      ====
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping blocks must be started with a class designation, like \`[.numbered-group]\``,
    });
  });

  it(`correctly lints only unlabeled opener`, () => {
    const adoc = stripIndent(`
      Foo bar.

      [.postscript]
      ====

      Foo bar
      and baz.

      ====

      Foo.

      ====

      Baz and Bar.

      ====
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(13);
    expect(results[0].message).toMatch(/must be started/);
  });
});

describe(`wrappingBlocks() - unterminated-wrapping-block`, () => {
  it(`lints an unterminated wrapping block`, () => {
    const adoc = stripIndent(`
      [.embedded-content-document]
      ====

      Foo bar
      and baz.
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `This block was never terminated with a \`====\` line.`,
    });
  });

  it(`can keep track of which one was not terminated`, () => {
    const adoc = stripIndent(`
      [.postscript]
      ====

      Foo bar
      and baz.

      ====

      [.postscript]
      ====

      Foo bar
      and baz.

      [.postscript]
      ====

      Foo bar
      and baz.

      ====
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(10);
  });

  it(`can find multiple violations`, () => {
    const adoc = stripIndent(`
      [.postscript]
      ====

      Foo bar
      and baz.

      [.postscript]
      ====

      Foo bar
      and baz.
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(2);
    expect(results[0].line).toBe(2);
    expect(results[1].line).toBe(8);
  });

  test(`terminated block OK`, () => {
    const adoc = stripIndent(`
      [.postscript]
      ====

      Foo bar
      and baz.

      ====
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(0);
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

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
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

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `This block was never terminated with a \`====\` line.`,
    });
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

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      line: 9,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping block delimiters must be surrounded by empty lines`,
      fixable: true,
      recommendation: `--> add an empty line before line 9`,
    });
    expect(results[1].line).toBe(10);
  });

  it(`lints numbered-group termination without opening`, () => {
    const adoc = stripIndent(`
      Foo bar.

      ====

      Foo bar.
    `).trim();

    const results = wrappingBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: false,
      type: `error`,
      rule: `wrapping-block`,
      message: `Wrapping blocks must be started with a class designation, like \`[.numbered-group]\``,
    });
  });
});
