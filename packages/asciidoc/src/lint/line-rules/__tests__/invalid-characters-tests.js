import invalidCharacters from '../invalid-characters';

describe('invalidCharacters()', () => {
  it('creates a lint violation result for a line with a bad character', () => {
    const line = '• is not allowed';
    const results = invalidCharacters(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 1,
      type: 'error',
      rule: 'invalid-character',
      message: 'Dissallowed character: `•`, code: `\\u2022` (BULLET)',
    });
  });

  const violations = [
    ['Foo | bar.'],
    ['@jared'],
  ];

  test.each(violations)('%s should be linted', adoc => {
    const lines = adoc.split('\n');
    let results = [];
    lines.forEach((line, index) => {
      const lineResults = invalidCharacters(line, lines, index + 1);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(1);
  });

  const allowed = [
    ['Jim jam.'],
    ['// lint-disable invalid-character\n• foo'],
  ];

  test.each(allowed)('%s should not be linted', adoc => {
    const lines = adoc.split('\n');
    let results = [];
    lines.forEach((line, index) => {
      const lineResults = invalidCharacters(line, lines, index + 1);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(0);
  });
});
