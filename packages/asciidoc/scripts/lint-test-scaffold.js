import myRule from '../my-slug';

describe('myRule()', () => {
  it('creates a lint for violation of `my-slug` rule', () => {
    const results = myRule('Some violation', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 3,
      type: 'error',
      rule: 'my-slug',
      message: 'your message here',
    });
  });

  const violations = [
    // ['Violation', 'Fixed'],
  ];

  xtest.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = myRule(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [
    // ['Not a violation'],
  ];

  xtest.each(allowed)('%s is not a lint violation', line => {
    expect(myRule(line, [], 1)).toHaveLength(0);
  });
});
