import unhyphenedWords from '../unhyphened-words';

describe('unhyphenedWords()', () => {
  it('creates a lint violation for line containing "to-day"', () => {
    const results = unhyphenedWords('To-day foo', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 1,
      type: 'error',
      rule: 'unhyphened-words',
      message:
        'Archaic hyphenations (like to-day and to-morrow) should be replaced with modern spelling.',
      fixable: true,
      recommendation: 'Today foo',
    });
  });

  const violations = [
    ['The sun-set was lovely', 'The sunset was lovely'],
    ['To-morrow foo', 'Tomorrow foo'],
    ['To-day bar', 'Today bar'],
    ['Foo to-day', 'Foo today'],
    ['Bed-side foo', 'Bedside foo'],
    ['Foo bed-side', 'Foo bedside'],
    ['Slave-holder foo', 'Slaveholder foo'],
    ['The slave-holders bar', 'The slaveholders bar'],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = unhyphenedWords(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [['To-dayfoo'], ['toto-daybar']];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(unhyphenedWords(line, [], 1)).toHaveLength(0);
  });
});
