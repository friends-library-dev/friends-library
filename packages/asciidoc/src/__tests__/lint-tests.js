import stripIndent from 'strip-indent';
import glob from 'glob';
import path from 'path';
import lint from '../lint';
import * as lineRules from '../lint/line-rules';
import * as blockRules from '../lint/block-rules';

describe('lint()', () => {
  it('creates a well formed lint result', () => {
    const results = lint("Ah! '`Tis thou!\n");
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 4,
      type: 'error',
      rule: 'smart-quotes',
      message: 'Incorrect usage of smart quotes/apostrophes',
      recommendation: "Ah! `'Tis thou!",
    });
  });

  it('aggregates multiple rule test results (block and line)', () => {
    const adoc = stripIndent(`
      == Ch 1

      [.chapter-synopsis]
      * 1999. Dies.

      Ah! '\`Tis thou!

      [.embedded-content-document]
      --

      Foo bar
      and baz.
    `).trim();
    const results = lint(`${adoc}\n`);
    expect(results).toHaveLength(3);
    expect(results[0].rule).toBe('list-year');
    expect(results[1].rule).toBe('smart-quotes');
    expect(results[2].rule).toBe('unterminated-open-block');
  });

  it('new lines do not cause duplicate results', () => {
    const adoc = '== Ch 1\n\n\'`Tis so rad!!\n';
    const results = lint(adoc);
    expect(results).toHaveLength(1);
  });
});

describe('line-rules export', () => {
  test('line-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../lint/line-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(lineRules)).toHaveLength(files.length);
  });
});

describe('block-rules export', () => {
  test('block-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../lint/block-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(blockRules)).toHaveLength(files.length);
  });
});
