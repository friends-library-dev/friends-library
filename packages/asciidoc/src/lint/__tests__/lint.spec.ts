import stripIndent from 'strip-indent';
import lint from '../lint';

describe('lint()', () => {
  it('creates a well formed lint result', () => {
    const results = lint("== C1\n\nAh! '`Tis thou!\n");
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: 4,
      type: 'error',
      rule: 'smart-quotes',
      message: 'Incorrect usage of smart quotes/apostrophes',
      recommendation: "Ah! `'Tis thou!",
      fixable: true,
    });
  });

  it('allows whitelisting rules', () => {
    const results = lint("Don't •\n", { include: ['smart-quotes'], lang: 'en' });
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('smart-quotes');
  });

  it('allows black-listing rules', () => {
    const results = lint("Don't •\n", {
      exclude: ['smart-quotes', 'chapter-heading'],
      lang: 'en',
    });
    expect(results).toHaveLength(1);
    expect(results[0].rule).toBe('invalid-characters');
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
    const adoc = "== Ch 1\n\n'`Tis so rad!!\n";
    const results = lint(adoc);
    expect(results).toHaveLength(1);
  });

  it('produces no errors for a comment line containing lint declaration', () => {
    const adoc = stripIndent(`
      == Ch 1

      // lint-disable invalid-characters "bad" stuff' ••
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
      message:
        'Comments should generally be removed, with the exceptions of: 1) comments to disable lint rules (e.g. `// lint-disable invalid-characters`), and 2) special cases where there would be a long-term value to keeping the comment (these lines can be marked with `--lint-ignore` to disable this lint warning)',
    });
  });
});
