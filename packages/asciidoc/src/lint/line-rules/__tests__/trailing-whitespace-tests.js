import trailingWhitespace from '../trailing-whitespace';

describe('trailingWhitespace()', () => {
  it('creates a lint violation result for a line with trailing whitespace', () => {
    const results = trailingWhitespace('== Chapter 1 ', [], 4);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: 13,
      type: 'error',
      rule: 'trailing-whitespace',
      message: 'Lines should not have trailing whitespace',
      fixable: true,
      recommendation: '== Chapter 1',
    });
  });

  it('does not lint error empty lines', () => {
    const results = trailingWhitespace('', [], 4);
    expect(results).toHaveLength(0);
  });
});
