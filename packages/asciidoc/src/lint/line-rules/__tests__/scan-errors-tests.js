import scanErrors from '../scan-errors';

describe('scanErrors()', () => {
  it('creates a lint violation result for a line with suspect `lime`', () => {
    const results = scanErrors('For a long lime I was sad', [], 1);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 12,
      type: 'error',
      rule: 'scan-errors',
      message: '"lime/s" is often a scanning error and should be corrected to "time/s"',
      fixable: false,
      recommendation: 'For a long time I was sad',
    });
  });

  const violations = [
    // *** lime > time ***
    [
      'The next, and last lime of Rebecca',
      'The next, and last time of Rebecca',
    ],
    [
      'principles in England in limes of suffering',
      'principles in England in times of suffering',
    ],

    // *** Wc > We ***
    ['Wc went', 'We went'],
    ['Then wc went', 'Then we went'],

    // *** arc > are
    ["'`you arc very welcome to that.`'", "'`you are very welcome to that.`'"],
    ['Arc you coming?', 'Are you coming?'],

    // *** arid > and
    ['extremity, arid times never', 'extremity, and times never'],
    ['Arid in turning any other', 'And in turning any other'],

    // *** bo > be ***
    ['female should bo just and', 'female should be just and'],

    // *** ray > my ***
    ['ray strength and help', 'my strength and help'],

    // *** T > I ***
    ['Then T went', 'Then I went'],
    ['Then t went', 'Then I went'],
    ['T began to', 'I began to'],
  ];

  test.each(violations)('`%s` should be a lint violation', (line, reco) => {
    const results = scanErrors(line, [], 1);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [
    // *** lime > time ***
    'These complimentary notices',
    'Then came to Lime.',
    'Oranges, lemons, limes, melons,',
    'like a vast furnace or a lime-kiln',
    'These districts team with bread-fruit, plantains, bananas, citrons, limes, vis, papaws',
    'otherwise by lime and other manure',
    'The houses are all white, being overcast with lime',
    'but being manured with lime, sea-weed, etc.',
    'ignorant of this age, that lime and stone,',
    'of an old house made up of lime, stones, and wood.',
    'using lime or white clay to make the',
    'sweetened lime-juice and water, with plain water',
    'free use of the chloride of lime',
    'these Limes are good', // uppercase L makes it not an error

    // ray > my
    'that John Ray was',
    'comfortable ray of light',
    "And thro`' the gloom a ray obedient broke.",

    // T > I
    'Then T. Scattergood came',
  ];

  test.each(allowed)('`%s` is not a lint violation', line => {
    expect(scanErrors(line, [], 1)).toHaveLength(0);
  });
});
