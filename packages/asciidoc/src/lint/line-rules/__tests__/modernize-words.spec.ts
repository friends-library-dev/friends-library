import modernizeWords from '../modernize-words';

const opts = {
  lang: 'en' as const,
  editionType: 'modernized' as const,
};

describe('modernizeWords()', () => {
  it('creates a lint for violation of `modernize-words` rule', () => {
    const results = modernizeWords('Those amongst us', [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 12,
      type: 'error',
      rule: 'modernize-words',
      message: '"amongst" should be replaced with "among" in modernized editions',
      fixable: true,
      recommendation: 'Those among us',
    });
  });

  const violations: [string, string][] = [
    ['Amongst a rude mob', 'Among a rude mob'],
    ['and amongst enemies', 'and among enemies'],
  ];

  test.each(violations)('`%s` should become "%s"', (line, reco) => {
    const results = modernizeWords(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed: [string][] = [['Samual Amongstrong came to meeting']];

  test.each(allowed)('%s is not a lint violation', line => {
    expect(modernizeWords(line, [], 1, opts)).toHaveLength(0);
  });

  test('maybe lint not detected without maybe flag', () => {
    const line = 'Those with faces set Zionward';
    expect(modernizeWords(line, [], 1, opts)).toHaveLength(0);
  });

  test('maybe lint detected with flag', () => {
    const line = 'Those with faces set Zionward';
    const results = modernizeWords(line, [], 1, {
      lang: 'en' as const,
      editionType: 'modernized' as const,
      maybe: true,
    });
    expect(results).toHaveLength(1);
    expect(results[0].fixable).toBe(false);
    expect(results[0].message).toBe(
      '"Zionward" is often (but not always!) better "towards Zion" in modernized editions',
    );
  });

  it('creates a lint to replace "intercourse"', () => {
    const results = modernizeWords('In their intercourse with', [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 10,
      type: 'error',
      rule: 'modernize-words',
      message:
        '"intercourse" should be replaced in modernized editions (communication, interaction, commerce, dealings, exchange, fellowship, communion, contact, correspondence, etc.)',
      fixable: false,
    });
  });

  const ejacCases = [
    'The following ejaculations were found',
    "He ejaculated: '`O Lord, thou art good",
    'expressed a short ejaculation to this effect:',
    'he was heard to ejaculate to this effect:',
    'often ejaculating with earnestness, "`O blessed Saviour',
  ];

  test.each(ejacCases)('%s is a lint vilation', adoc => {
    expect(modernizeWords(adoc, [], 1, opts)).toHaveLength(1);
  });
});
