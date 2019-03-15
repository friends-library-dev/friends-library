import joinWords from '../join-words';

describe('joinWords()', () => {
  it('creates a lint for violation of `join-words` rule', () => {
    const adoc = 'I searched up and down and every\nwhere for her.';
    const lines = adoc.split('\n');
    const results = joinWords(lines[0], lines, 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 28,
      type: 'error',
      rule: 'join-words',
      message: '"every where" should be combined to become "everywhere"',
      fixable: true,
      recommendation: 'I searched up and down and\neverywhere for her.',
    });
  });

  const violations = [
    ['Every where I go', 'Everywhere I go'],
    ['Foo every where bar', 'Foo everywhere bar'],
    ['Foo every\nwhere I go I see you', 'Foo everywhere\nI go I see you'],

    ['Every thing I do', 'Everything I do'],
    ['Foo every thing bar', 'Foo everything bar'],
    ['Foo every\nthing I do foo bar baz', 'Foo everything\nI do foo bar baz'],

    ['A tender spirited man', 'A tender-spirited man'],
    ['A hard hearted man', 'A hard-hearted man'],
    ['He was a hard\nhearted man', 'He was a\nhard-hearted man'],
    ['A honest hearted man', 'A honest-hearted man'],
    ['He was a honest\nhearted man', 'He was a\nhonest-hearted man'],
  ];

  test.each(violations)('"%s" adoc should become "%s"', (adoc, fixed) => {
    const lines = adoc.split('\n');
    let results = [];
    lines.forEach((line, i) => {
      results = results.concat(joinWords(line, lines, i + 1));
    });
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(fixed);
  });

  const allowed = [
    ['Foo every\nWhere'],
  ];

  test.each(allowed)('multiline adoc should not have lint error', adoc => {
    const lines = adoc.split('\n');
    let results = [];
    lines.forEach((line, i) => {
      results = results.concat(joinWords(line, lines, i + 1));
    });
    expect(results).toHaveLength(0);
  });
});
