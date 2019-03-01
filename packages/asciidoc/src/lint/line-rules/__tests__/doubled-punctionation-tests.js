import doubledPunctuation from '../doubled-punctuation';

describe('doubledPunctuation()', () => {
  it('creates a lint violation result for a line with doubled punctuation', () => {
    const results = doubledPunctuation('Foo,, bar', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 5,
      type: 'error',
      rule: 'doubled-punctuation',
      message: 'Invalid doubled punctuation mark',
      recommendation: 'Foo, bar',
      fixable: true,
    });
  });

  const violations = [
    ["Foo`'`'", "Foo`'", false],
    ['Foo;;', 'Foo;', true],
  ];

  test.each(violations)('%s should be %s', (line, reco, fixable) => {
    const results = doubledPunctuation(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
    expect(results[0].fixable).toBe(fixable);
  });

  const allowed = [
    ['Wow!!'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(doubledPunctuation(line, [], 1)).toHaveLength(0);
  });
});
