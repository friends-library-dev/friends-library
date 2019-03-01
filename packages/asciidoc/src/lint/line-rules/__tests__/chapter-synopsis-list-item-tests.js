import stripIndent from 'strip-indent';
import chapterSynopsisListItem from '../chapter-synopsis-list-item';

describe('chapterSynopsisListItem()', () => {
  it('creates a lint violation result for a line with no asterisks', () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.chapter-synopsis]
      Went to Nantucket

      Foobar.
    `).trim();
    const lines = adoc.split('\n');
    const results = chapterSynopsisListItem(lines[2], lines, 3);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: 1,
      type: 'error',
      rule: 'chapter-synopsis-list-item',
      message: 'Chapter synopsis list items must begin with exactly `* `',
      recommendation: '* Went to Nantucket',
      fixable: true,
    });
  });

  it('creates lint violations for multiple lines', () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.chapter-synopsis]
      * Went to Nantucket
      Foo bar (BAD!)
      * This line is OK
      ** Also BAD!

      Foobar.
    `).trim();

    let results = [];
    const lines = adoc.split('\n');
    lines.forEach((line, index) => {
      const lineResults = chapterSynopsisListItem(line, lines, index + 1);
      results = results.concat([...lineResults]);
    });
    expect(results).toHaveLength(2);
    expect(results[0].recommendation).toBe('* Foo bar (BAD!)');
    expect(results[1].recommendation).toBe('* Also BAD!');
  });
});
