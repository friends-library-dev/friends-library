import footnoteSplitSpacing from '../footnote-split-spacing';

const opts = { lang: 'en' as const };

describe('footnoteSplitSpacing()', () => {
  it('creates a lint for violation of `footnote-split-spacing` rule', () => {
    const adoc = 'footnote:[Foobar\n{footnote-paragraph-split}\n\nbar baz]';
    const lines = adoc.split('\n');
    const results = footnoteSplitSpacing(lines[1], lines, 2, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 3,
      column: 1,
      type: 'error',
      rule: 'footnote-split-spacing',
      message: 'footnote paragraph splits must not be followed by empty lines',
      fixable: true,
      recommendation: '<-- remove line 3',
    });
  });
});
