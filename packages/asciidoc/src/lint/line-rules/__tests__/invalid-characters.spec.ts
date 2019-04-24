import invalidCharacters from '../invalid-characters';

const opts = { lang: 'en' as const };

describe('invalidCharacters()', () => {
  it('creates a lint violation result for a line with a bad character', () => {
    const line = '• is not allowed';
    const results = invalidCharacters(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      line: 1,
      column: 1,
      type: 'error',
      rule: 'invalid-characters',
      message: 'Dissallowed character: `•`, code: `\\u2022` (BULLET)',
    });
  });

  test('characters in an inline passthrough are not violations', () => {
    const line = 'Foo +++<b>•|</b>+++ bar.';
    const results = invalidCharacters(line, [], 1, opts);
    expect(results).toHaveLength(0);
  });

  const violations = [
    ['Foo | bar.'],
    ['@jared'],
    ['Josué Alvarado is not allowed in English versions'],
  ];

  test.each(violations)('%s should be linted', adoc => {
    const lines = adoc.split('\n');
    let results: any[] = [];
    lines.forEach((line, index) => {
      const lineResults = invalidCharacters(line, lines, index + 1, opts);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(1);
  });

  const allowed = [
    ['Jim jam.'],
    ['// lint-disable invalid-characters\n• foo'],
    ['<<<<<<<'], // caught by `git-conflict-marker`
    ['>>>>>>>'], // caught by `git-conflict-marker`
  ];

  test.each(allowed)('%s should not be linted', adoc => {
    const lines = adoc.split('\n');
    let results: any[] = [];
    lines.forEach((line, index) => {
      const lineResults = invalidCharacters(line, lines, index + 1, opts);
      results = results.concat(...lineResults);
    });
    expect(results).toHaveLength(0);
  });

  const deleteables = [
    ['Foo• bar', 'Foo bar'],
    ['be­stowed', 'bestowed'], // invisible SOFT HYPHEN in first
  ];

  test.each(deleteables)('%s is fixable by deleting', (adoc, fixed) => {
    const results = invalidCharacters(adoc.replace(/_/g, ' '), [], 1, opts);
    expect(results[0]).toMatchObject({
      fixable: true,
      recommendation: fixed,
    });
  });

  const replaceables = [
    ['Foo – Bar', 'Foo - Bar'], // EN DASH > regular dash
    ['Bob’s', "Bob`'s"],
    ['‘Hello', "'`Hello"],
    ['“Foo', '"`Foo'],
    ['Bar”', 'Bar`"'],
    ['О Lord.', 'O Lord.'], // first is CYRILLIC CAPITAL O
  ];

  test.each(replaceables)('%s is fixable by replacing', (adoc, fixed) => {
    const results = invalidCharacters(adoc.replace(/_/g, ' '), [], 1, opts);
    expect(results[0]).toMatchObject({
      fixable: true,
      recommendation: fixed,
    });
  });

  describe('fixing NO-BREAK SPACE', () => {
    const fixable = [
      // underscores will be replaced with the NO-BREAK SPACE char
      ['_Foo', 'Foo'],
      ['footnote:[_Foo', 'footnote:[Foo'],
      ['Foo _bar', 'Foo bar'],
      ['Foo_ bar', 'Foo bar'],
      ['phrase_"`the Word,`"', 'phrase "`the Word,`"'],
      ['of _"`the Word,`"', 'of "`the Word,`"'],
      ['_', ''],
      ['_1771, Foo', '1771, Foo'],
      ['wills, _or of', 'wills, or of'],
      [
        'footnote:[lib. 3._Reg. cap. 9. ver. 4.]',
        'footnote:[lib. 3. Reg. cap. 9. ver. 4.]',
      ],
      ['Savior,_that', 'Savior, that'],
      [' George Dillwyn`" _', ' George Dillwyn`" '],
      ['______Foo', 'Foo'],
      [' Watson) _"`in', ' Watson) "`in'],
    ];

    test.each(fixable)('%s is fixable', (adoc, fixed) => {
      const results = invalidCharacters(adoc.replace(/_/g, ' '), [], 1, opts);
      expect(results[0]).toMatchObject({
        fixable: true,
        recommendation: fixed,
      });
    });
  });

  describe('when language=es', () => {
    const es = { lang: 'es' as const };
    test('accented characters are allowed', () => {
      const results = invalidCharacters('¡Josué esta cool!', [], 1, es);
      expect(results).toHaveLength(0);
    });
  });
});
