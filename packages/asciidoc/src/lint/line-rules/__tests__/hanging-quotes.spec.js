import hangingQuotes from '../hanging-quotes';

describe('hangingQuotes()', () => {
  it('creates lint violations for git conflict markers', () => {
    const line = 'Foo bar "`';

    const results = hangingQuotes(line, [], 1);

    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 9,
      type: 'error',
      rule: 'hanging-quotes',
      message: 'Invalid hanging quotation. Perhaps move it to the next line?',
    });
  });
});
