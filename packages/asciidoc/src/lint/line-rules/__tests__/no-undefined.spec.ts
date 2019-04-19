import noUndefined from '../no-undefined';

describe('noUndefined()', () => {
  it('creates a lint for violation of `no-undefined` rule', () => {
    const results = noUndefined('Foo undefined bar', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 5,
      fixable: false,
      type: 'error',
      rule: 'no-undefined',
      message: '`undefined` is usually a scripting error artifact and should be removed',
    });
  });

  const violations: [string][] = [
    ['Foo undefined'],
    ['undefined foo'],
    ['Foo barundefined'],
  ];

  test.each(violations)('`%s` should be a lint violation', line => {
    const results = noUndefined(line, [], 1);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [['Undefined foobar']];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(noUndefined(line, [], 1)).toHaveLength(0);
  });
});
