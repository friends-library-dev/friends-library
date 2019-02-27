import glob from 'glob';
import path from 'path';
import lint from '../lint';
import * as rules from '../lint/rules';

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

  it('aggregates multiple rule test results', () => {
    const results = lint("Ch 1\n\n* 1799. Dies.\n\nAh! '`Tis thou!\n");
    expect(results).toHaveLength(2);
    expect(results[0].rule).toBe('list-year');
    expect(results[1].rule).toBe('smart-quotes');
  });

  it('new lines do not cause duplicate results', () => {
    const adoc = '== Ch 1\n\n\'`Tis so rad!!\n';
    const results = lint(adoc);
    expect(results).toHaveLength(1);
  });
});

describe('rules export', () => {
  test('rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../lint/rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(rules)).toHaveLength(files.length);
  });
});
