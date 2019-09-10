import hangingQuotes from '../hanging-quotes';

const opts = { lang: 'en' as const };

describe('hangingQuotes()', () => {
  it('creates lint violations for git conflict markers', () => {
    const line = 'Foo bar "`';

    const results = hangingQuotes(line, [], 1, opts);

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 9,
      type: 'error',
      rule: 'hanging-quotes',
      message: 'Invalid hanging quotation. Perhaps move it to the next line?',
    });
  });

  const violations = ['== Ch\n\nFoo bar "`\njim jam.`"'];

  test.each(violations)('multiline adoc should have lint error', adoc => {
    const lines = adoc.split('\n');
    let results: any[] = [];
    lines.forEach((line, i) => {
      results = results.concat(hangingQuotes(line, lines, i + 1, opts));
    });
    expect(results).toHaveLength(1);
  });
});
