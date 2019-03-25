import emptyRole from '../empty-role';

describe('emptyRole()', () => {
  it('creates a lint for violation of `empty-role` rule', () => {
    const results = emptyRole('[.foobar.]', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 9,
      type: 'error',
      rule: 'empty-role',
      message: 'empty (periods must be followed by something or omitted)',
      fixable: false,
      recommendation: '[.foobar]',
    });
  });

  // prettier-ignore
  const violations = [
    ['[.embedded-content-document.]', '[.embedded-content-document]'],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = emptyRole(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  // prettier-ignore
  const allowed = [
    ['[quote.scripture, , Matt. 11:28-30.]'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(emptyRole(line, [], 1)).toHaveLength(0);
  });
});
