import unhyphenedWords from '../unhyphened-words';

describe('unhyphenedWords()', () => {
  it('creates a lint violation for line containing "to-day"', () => {
    const results = unhyphenedWords('To-day foo', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 3,
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
    ['By the road-side we', 'By the roadside we'],
    ['his death-bed was', 'his deathbed was'],
    ['in the day-time she', 'in the daytime she'],
    ['Have the pre-eminence', 'Have the preeminence'],
    ['He was pre-eminent', 'He was preeminent'],
    ['and reigned pre-eminently', 'and reigned preeminently'],
    ['death to re-enter and', 'death to reenter and'],
    ['He re-entered that nation', 'He reentered that nation'],
    ['* Re-enters Wales', '* Reenters Wales'],
    ['re-establishing the discipline', 'reestablishing the discipline'],
    ['I have been re-examining', 'I have been reexamining'],
    ['She co-operated', 'She cooperated'],
    ['Co-operation was improved', 'Cooperation was improved'],
    ['foo anti-christ bar', 'foo antichrist bar'],
    ['foo anti-Christ bar', 'foo antichrist bar'],
    ['Anti-christ foo', 'Antichrist foo'],
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
