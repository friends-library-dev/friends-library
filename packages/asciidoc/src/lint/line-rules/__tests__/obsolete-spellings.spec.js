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
      message: '"staid" should be replaced with "stayed" in all editions',
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
    ['Does it not behove me to study', 'Does it not behoove me to study', true],
    ['It behoves me', 'It behooves me', true],
    ['The hardheartedness was', 'The hard-heartedness was', true],
    ['My fellow-creatures', 'My fellow creatures', true],
    ['Fellow-creatures are', 'Fellow creatures are', true],
    ['faint-hearted foo', 'fainthearted foo', true],
    ['broken-hearted foo', 'brokenhearted foo', true],
    ['light-hearted foo', 'lighthearted foo', true],
    ['Aaron, but of Melchisedec;', 'Aaron, but of Melchizedek;', true],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco, fixable) => {
    const results = obsoleteSpellings(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
    expect(results[0].fixable).toBe(fixable);
  });

  const allowed = [['fooconnexion bar']];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(obsoleteSpellings(line, [], 1)).toHaveLength(0);
  });
});
