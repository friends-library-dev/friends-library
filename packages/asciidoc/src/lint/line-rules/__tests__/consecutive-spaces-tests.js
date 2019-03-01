import stripIndent from 'strip-indent';
import consecutiveSpaces from '../consecutive-spaces';

describe('consecutiveSpaces()', () => {
  it('creates a lint violation result for a line with consecutive spaces', () => {
    const results = consecutiveSpaces('Foo   bar', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 5,
      type: 'error',
      rule: 'consecutive-spaces',
      message: 'Consecutive spaces are not allowed',
      recommendation: 'Foo bar',
      fixable: true,
    });
  });

  it('allows consecutive spaces in footnote poetry', () => {
    const adoc = stripIndent(`
      Foobar.^
      footnote:[Here is a poem:
      \`    foo bar
           so much baz. \`
      and now the poem is done.]
    `).trim();
    const lines = adoc.split('\n');

    let results = [];
    lines.forEach((line, index) => {
      results = results.concat(...consecutiveSpaces(line, lines, index + 1));
    });
    expect(results).toHaveLength(0);
  });
});
