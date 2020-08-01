import scanErrors from '../scan-errors';

const opts = { lang: `en` as const };

describe(`scanErrors()`, () => {
  it(`creates a lint violation result for a line with suspect \`lime\``, () => {
    const results = scanErrors(`For a long lime I was sad`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 12,
      type: `error`,
      rule: `scan-errors`,
      message: `"lime" is often a scanning error and should be corrected to "time"`,
      fixable: false,
      recommendation: `For a long time I was sad`,
    });
  });

  const violations = [
    // *** lime > time ***
    [`The next, and last lime of Rebecca`, `The next, and last time of Rebecca`],
    [`in England in limes of suffering`, `in England in times of suffering`],

    // *** `ing`
    [`and will reward us accord, ing to`, `and will reward us according to`],
    [`in the morn.ing, we sounded`, `in the morning, we sounded`],
    [`sum not exceed\`' ing ten pounds`, `sum not exceeding ten pounds`],
    [`In the morn ing`, `In the morning`],
    [`feeble, totter, ing child`, `feeble, tottering child`],
    [`in the bury-ing-place all`, `in the burying-place all`],

    // *** Wc > We ***
    [`Wc went`, `We went`],
    [`Then wc went`, `Then we went`],

    // *** arc > are
    [`'\`you arc very welcome to that.\`'`, `'\`you are very welcome to that.\`'`],
    [`Arc you coming?`, `Are you coming?`],

    // *** arid > and
    [`extremity, arid times never`, `extremity, and times never`],
    [`Arid in turning any other`, `And in turning any other`],

    // *** bo > be ***
    [`female should bo just and`, `female should be just and`],

    // *** me > mc ***
    [`he asked mc if I`, `he asked me if I`],

    // *** aud > and ***
    [`foo aud bar`, `foo and bar`],
    [`Aud foo bar`, `And foo bar`],

    // *** sec > see ***
    [`I could sec that`, `I could see that`],

    // *** ray > my ***
    [`ray strength and help`, `my strength and help`],

    // *** T > I ***
    [`Then T went`, `Then I went`],
    [`Then t went`, `Then I went`],
    [`T began to`, `I began to`],

    // *** Fie > He ***
    [`Fie told me`, `He told me`],

    // *** f > I
    [`I apprehended f had`, `I apprehended I had`],
    [`F humbly hope I may say`, `I humbly hope I may say`],
  ];

  test.each(violations)(`\`%s\` should be a lint violation`, (line, reco) => {
    const results = scanErrors(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [
    // *** lime > time ***
    `These complimentary notices`,
    `Then came to Lime.`,
    `Oranges, lemons, limes, melons,`,
    `like a vast furnace or a lime-kiln`,
    `These districts team with bread-fruit, plantains, bananas, citrons, limes, vis, papaws`,
    `otherwise by lime and other manure`,
    `The houses are all white, being overcast with lime`,
    `but being manured with lime, sea-weed, etc.`,
    `ignorant of this age, that lime and stone,`,
    `of an old house made up of lime, stones, and wood.`,
    `using lime or white clay to make the`,
    `sweetened lime-juice and water, with plain water`,
    `free use of the chloride of lime`,
    `these Limes are good`, // uppercase L makes it not an error

    // ray > my
    `that John Ray was`,
    `comfortable ray of light`,
    `And thro\`' the gloom a ray obedient broke.`,

    // T > I
    `Then T. Scattergood came`,

    // mc > me
    `Joseph Mc Intire`,

    // sec > see
    `Chapter 4, sec. 3`,
    `Sec. 5, ch. 5`,

    // fife > life
    `appearances were discouraging, the fife and fiddle playing,`,
  ];

  test.each(allowed)(`\`%s\` is not a lint violation`, (line) => {
    expect(scanErrors(line, [], 1, opts)).toHaveLength(0);
  });
});
