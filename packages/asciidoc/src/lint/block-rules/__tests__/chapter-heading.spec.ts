import stripIndent from 'strip-indent';
import chapterHeading from '../chapter-heading';

describe('chapterHeading()', () => {
  it('block with no chapter heading lints first line', () => {
    const adoc = 'Foo bar\n';

    const results = chapterHeading(adoc);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: false,
      type: 'error',
      rule: 'chapter-heading',
      message: 'Every file must have exactly one chapter level heading `== `',
      fixable: false,
    });
  });

  it('correctly lints duplicate', () => {
    const adoc = stripIndent(`
        == Ch 1

        Foo bar.

        == Ch 2

        === Subheading
      `).trim();

    const results = chapterHeading(adoc);
    expect(results).toHaveLength(1);
    expect(results[0].line).toBe(5);
    expect(results[0].message).toBe('Duplicate chapter heading `== ` -- see line 1');
  });

  it('does not lint file if only problem is invalid heading format', () => {
    const adoc = '==  Ch 1\n'; // <-- too many spaces

    const results = chapterHeading(adoc);
    expect(results).toHaveLength(0);
  });
});
