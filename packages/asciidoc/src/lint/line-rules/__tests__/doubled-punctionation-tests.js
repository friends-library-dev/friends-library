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
    ['Foo., bar', undefined, undefined],
    ['FB., bar', undefined, undefined],
  ];

  test.each(violations)('%s should be a violation', (line, reco, fixable) => {
    const results = doubledPunctuation(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
    expect(results[0].fixable).toBe(fixable);
  });

  const allowed = [
    ['Miscellanies,_ vol. iv., 250-255.'],
    ['iii, 2., and xviii.'],
    ['jr., and I'],
    ['Foo etc., and'],
    ['Bob Sr., and I'],
    ['Foo viz., and'],
    ['G. F., and Bob'],
    ['Bob jun., foo'],
    ['5th ult., then'],
    ['3rd mo., then'],
    ['vol., and'],
    ['resteth, i. e., John'],
    ['of the 10th inst., and'],
    ['foo ibid., and'],
    ['Guildford Co., NJ'],
    ["Upon calling at dear J. S`'s., I went"],
    ['sold for £111, 5s., but'],
    ['Eph. 5:2,8 Pet., 1:4.'],
    ['Seventh Edition.::'],
    ['by J. Elliott, M.D.;'],
    ['obey, etc.!'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(doubledPunctuation(line, [], 1)).toHaveLength(0);
  });
});
