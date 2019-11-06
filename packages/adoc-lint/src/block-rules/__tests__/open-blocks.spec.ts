import stripIndent from 'strip-indent';
import openBlocks from '../open-blocks';

const opts = { lang: 'en' as const };

describe('openBlocks() - missing-surrounding-space', () => {
  it('lints closing terminator without proper spacing before', () => {
    const adoc = stripIndent(`
      Foo bar.

      [.embedded-content-document.letter]
      --

      Foo bar
      and baz.
      --

      Foo
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 8,
      column: false,
      type: 'error',
      rule: 'open-block',
      message: 'Open block delimiters should be surrounded by empty lines',
      recommendation: '--> add an empty line before line 8',
      fixable: true,
    });
  });

  it('lints closing terminator without proper spacing after', () => {
    const adoc = stripIndent(`
      Foo bar.

      [.embedded-content-document.letter]
      --

      Foo bar
      and baz.

      --
      Foo
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 10,
      column: false,
      type: 'error',
      rule: 'open-block',
      message: 'Open block delimiters should be surrounded by empty lines',
      recommendation: '--> add an empty line before line 10',
      fixable: true,
    });
  });

  it('lints opening terminator without proper spacing after', () => {
    const adoc = stripIndent(`
      Foo bar.

      [.embedded-content-document.letter]
      --
      Foo bar
      and baz.

      --

      Foo
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 5,
      column: false,
      type: 'error',
      rule: 'open-block',
      message: 'Open block delimiters should be surrounded by empty lines',
      recommendation: '--> add an empty line before line 5',
      fixable: true,
    });
  });
});

describe('openBlocks() - unlabeled-open-block-delimiter', () => {
  it('lints the opening of a block with no class label', () => {
    const adoc = stripIndent(`
      Foo bar.

      --

      Foo bar
      and baz.

      --
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: false,
      type: 'error',
      rule: 'open-block',
      message:
        'Open blocks must be started with a class designation, like `[.embedded-content-document.letter]`',
    });
  });

  it('correctly lints only unlabeled opener', () => {
    const adoc = stripIndent(`
      Foo bar.

      [.embedded-content-document.letter]
      --

      Foo bar
      and baz.

      --

      Foo.

      --

      Baz and Bar.

      --
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(13);
    expect(results[0].message).toMatch(/must be started/);
  });
});

describe('openBlocks() - unterminated-open-block', () => {
  it('lints an unterminated open block', () => {
    const adoc = stripIndent(`
      [.embedded-content-document]
      --

      Foo bar
      and baz.
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 2,
      column: false,
      type: 'error',
      rule: 'open-block',
      message: 'This block was never terminated with a `--` line.',
    });
  });

  it('can keep track of which one was not terminated', () => {
    const adoc = stripIndent(`
      [.embedded-content-document]
      --

      Foo bar
      and baz.

      --

      [.embedded-content-document]
      --

      Foo bar
      and baz.

      [.embedded-content-document]
      --

      Foo bar
      and baz.

      --
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(10);
  });

  it('can find multiple violations', () => {
    const adoc = stripIndent(`
      [.embedded-content-document]
      --

      Foo bar
      and baz.

      [.embedded-content-document]
      --

      Foo bar
      and baz.
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(2);
    expect(results[0].line).toBe(2);
    expect(results[1].line).toBe(8);
  });

  test('terminated block OK', () => {
    const adoc = stripIndent(`
      [.embedded-content-document]
      --

      Foo bar
      and baz.

      --
    `).trim();

    const results = openBlocks(adoc, opts);
    expect(results).toHaveLength(0);
  });
});
