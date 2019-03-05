import stripIndent from 'strip-indent';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import { lint, lintPath } from '../lint';
import * as lineRules from '../lint/line-rules';
import * as blockRules from '../lint/block-rules';

jest.mock('fs-extra');

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

  it('allows whitelisting rules', () => {
    const results = lint('Don\'t •\n', ['smart-quotes']);
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('smart-quotes');
  });

  it('allows black-listing rules', () => {
    const results = lint('Don\'t •\n', null, ['smart-quotes']);
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('invalid-character');
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
    expect(results[2].rule).toBe('open-block');
  });

  it('new lines do not cause duplicate results', () => {
    const adoc = '== Ch 1\n\n\'`Tis so rad!!\n';
    const results = lint(adoc);
    expect(results).toHaveLength(1);
  });

  it('produces no errors for a comment line containing lint declaration', () => {
    const adoc = stripIndent(`
      == Ch 1

      // lint-disable invalid-character "bad" stuff' ••
      More bad stuff ••

      Foo.
    `).trim();

    const results = lint(`${adoc}\n`);
    expect(results).toHaveLength(0);
  });

  it('produces warning for comment line containing no lint declaration', () => {
    const adoc = stripIndent(`
      == Ch 1

      // I wasn't sure what todo about this line...
      Jim jam, foo bar.
    `).trim();

    const results = lint(`${adoc}\n`);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      line: 3,
      column: false,
      type: 'warning',
      rule: 'temporary-comments',
      message: 'Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. `// lint-disable invalid-character`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with `--lint-ignore` to disable this lint warning)',
    });
  });
});

describe('line-rules export', () => {
  test('line-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../lint/line-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(lineRules)).toHaveLength(files.length);
  });
});

test('rule functions have slug property', () => {
  const slugs = new Set();
  const allRules = [lineRules, blockRules];
  allRules.forEach(rules => {
    Object.values(rules).forEach(rule => {
      expect(typeof rule.slug).toBe('string');
      if (slugs.has(rule.slug)) {
        throw new Error(`Duplicate rule slug: ${rule.slug}`);
      }
      slugs.add(rule.slug);
    });
  });
});

describe('block-rules export', () => {
  test('block-rules/index.js exports all rules', () => {
    const files = glob.sync(path.resolve(__dirname, '../lint/block-rules/*.js'))
      .filter(file => !file.match(/index\.js$/));
    expect(Object.values(blockRules)).toHaveLength(files.length);
  });
});

describe('lintPath()', () => {
  beforeEach(() => {
    glob.sync = jest.fn();
  });

  it('throws if you pass a non-existent full path', () => {
    fs.existsSync.mockReturnValue(false);
    expect(() => lintPath('/path/to/foo.adoc')).toThrowError(/does not exist/);
  });

  it('throws if the path contains no asciidoc files', () => {
    fs.existsSync.mockReturnValue(true);
    glob.sync.mockReturnValue([]); // <-- no files
    expect(() => lintPath('/en/george-fox/')).toThrowError(/No files/);
  });

  it('lints the globbed paths and returns map of lint data', () => {
    fs.existsSync.mockReturnValue(true);
    glob.sync.mockReturnValue(['/foo.adoc']);
    fs.readFileSync.mockReturnValue({ toString: () => '® bad char\n' });

    const map = lintPath('/');

    expect(map.count()).toBe(1);
    expect(map.count(l => l.rule === 'invalid-character')).toBe(1);
    expect(map.count(l => l.rule === 'leading-whitespace')).toBe(0);

    expect(map).toEqual(new Map([['/foo.adoc', {
      path: '/foo.adoc',
      adoc: '® bad char\n',
      lints: [{
        type: 'error',
        rule: 'invalid-character',
        column: 1,
        line: 1,
        message: expect.any(String),
      }],
    }]]));
  });
});
