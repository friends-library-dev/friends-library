import obsoleteSpellings from '../obsolete-spellings';

const opts = { lang: 'en' as const };

describe('obsoleteSpellings()', () => {
  it('creates a lint for violation of `obsolete-spellings` rule', () => {
    const results = obsoleteSpellings('Staid the night', [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      line: 1,
      column: 4,
      type: 'error',
      rule: 'obsolete-spellings',
      message: '"Staid" should be replaced with "Stayed" in all editions',
      fixable: true,
      recommendation: 'Stayed the night',
    });
  });

  const violations = [
    ['her near connexions into', 'her near connections into'],
    ['Connexion, foo', 'Connection, foo'],
    ['Foo connexion', 'Foo connection'],
    ['We staid the night', 'We stayed the night'],
    ['Staid till first day', 'Stayed till first day'],
    ['"`Staid`" foo', '"`Stayed`" foo'],
    ['Does it not behove me to study', 'Does it not behoove me to study'],
    ['It behoves me', 'It behooves me'],
    ['foo unskilfully bar', 'foo unskillfully bar'],
    ['foo wilfulness bar', 'foo willfulness bar'],
    ['he skilfully foo', 'he skillfully foo'],
    ['he was subtil', 'he was subtle'],
    ['the subtilty of the serpent', 'the subtlety of the serpent'],
    ['subtilly crept in', 'subtly crept in'],
    ['The hardheartedness was', 'The hard-heartedness was'],
    ['My fellow-creatures', 'My fellow creatures'],
    ['Fellow-creatures are', 'Fellow creatures are'],
    ['faint-hearted foo', 'fainthearted foo'],
    ['broken-hearted foo', 'brokenhearted foo'],
    ['light-hearted foo', 'lighthearted foo'],
    ['Aaron, but of Melchisedec;', 'Aaron, but of Melchizedek;'],
    ['Aaron, but of Melchizedeck;', 'Aaron, but of Melchizedek;'],
    ['Aaron, but of Melchisedek;', 'Aaron, but of Melchizedek;'],
    ['within the vail.', 'within the veil.'],
    ['that would vail the seed,', 'that would veil the seed,'],
    ['through all vails, entering into', 'through all veils, entering into'],
    ['it comes again to be vailed', 'it comes again to be veiled'],
    ['you go to gaol', 'you go to jail'],
    ['the gaoler said', 'the jailer said'],
    ["the under-gaoler`'s name", "the under-jailer`'s name"],
    ['my burthen increased', 'my burden increased'],
    ['it was burthensome', 'it was burdensome'],
    ['she was burthened', 'she was burdened'],
    ['with burthens hard to', 'with burdens hard to'],
    ['the burthen-bearers', 'the burden-bearers'],
    ['foo burthens--each', 'foo burdens--each'],
    ['the judgment-seat of', 'the judgment seat of'],
    ["of Sion`'s true", "of Zion`'s true"],
    ['welfare of Sion to', 'welfare of Zion to'],
    ['their faces Sion-ward,', 'their faces Zionward,'],
    ['their faces Zion-ward,', 'their faces Zionward,'],
    ["foo inn-keeper`'s bar", "foo innkeeper`'s bar"],
    ['some spiritually-minded people', 'some spiritually minded people'],
    ['Wo! to you!', 'Woe! to you!'],
    ['my fellow-servants', 'my fellow servants'],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = obsoleteSpellings(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  // prettier-ignore
  const allowed = [
    ['fooconnexion bar'],
    ['Aaron Vail, Paul Upton'],
  ];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(obsoleteSpellings(line, [], 1, opts)).toHaveLength(0);
  });
});
