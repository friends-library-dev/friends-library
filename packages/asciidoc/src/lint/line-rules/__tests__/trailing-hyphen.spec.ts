import stripIndent from 'strip-indent';
import trailingHyphen from '../trailing-hyphen';

const opts = { lang: 'en' as const };

describe('trailingHyphen()', () => {
  it('lints a line with a trailing hyphen', () => {
    const adoc = 'More self-\nabasedness is good.';
    const lines = adoc.split('\n');
    const results = trailingHyphen(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 10,
      type: 'error',
      rule: 'trailing-hyphen',
      message: 'Lines may not end with a hyphen',
      recommendation: 'More self-abasedness\nis good.',
      fixable: true,
    });
  });

  it('moves hyphenated to next line if shorter', () => {
    const adoc = 'Foo bar is so baz-\nzy sir!';
    const lines = adoc.split('\n');
    const results = trailingHyphen(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe('Foo bar is so\nbaz-zy sir!');
  });

  it('wont make recommendation if next line is a comment', () => {
    const adoc = 'Foo bar-\n// lint-disable foo';
    const lines = adoc.split('\n');
    const results = trailingHyphen(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBeUndefined();
  });

  it('wont make recommendation if next line starts with hyphen', () => {
    const adoc = 'Foo bar-\n-and baz';
    const lines = adoc.split('\n');
    const results = trailingHyphen(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBeUndefined();
  });

  it('does not flag special footnote poetry stanza breaks', () => {
    const adoc = stripIndent(`
      Foobar.^
      footnote:[Here is a poem:
      \`    foo bar
           - - - - - -
           so much baz. \`
      and now the poem is done.]
    `).trim();
    const lines = adoc.split('\n');
    const results = trailingHyphen(lines[3], lines, 4, opts);
    expect(results).toHaveLength(0);
  });
});
