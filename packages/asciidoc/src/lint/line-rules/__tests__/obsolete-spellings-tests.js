import obsoleteSpellings from '../obsolete-spellings';

describe('obsoleteSpellings()', () => {
  it('creates a lint for violation of `obsolete-spellings` rule', () => {
    const results = obsoleteSpellings('Staid the night', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      line: 1,
      column: 1,
      type: 'error',
      rule: 'obsolete-spellings',
      message: 'Obsolete spellings should be replaced in all editions',
      fixable: true,
      recommendation: 'Stayed the night',
    });
  });

  const violations = [
    ['her near connexions into', 'her near connections into', true],
    ['Connexion, foo', 'Connection, foo', true],
    ['Foo connexion', 'Foo connection', true],
    ['We staid the night', 'We stayed the night', true],
    ['Staid till first day', 'Stayed till first day', true],
    ['"`Staid`" foo', '"`Stayed`" foo', true],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco, fixable) => {
    const results = obsoleteSpellings(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
    expect(results[0].fixable).toBe(fixable);
  });

  const allowed = [
    ['fooconnexion bar'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(obsoleteSpellings(line, [], 1)).toHaveLength(0);
  });
});
