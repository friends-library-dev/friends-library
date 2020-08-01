import unhyphenedWords from '../unhyphened-words';

const opts = { lang: `en` as const };

describe(`unhyphenedWords()`, () => {
  it(`creates a lint violation for line containing "to-day"`, () => {
    const results = unhyphenedWords(`To-day foo`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 3,
      type: `error`,
      rule: `unhyphened-words`,
      message: `"To-day" should be replaced with "Today" in all editions`,
      fixable: true,
      recommendation: `Today foo`,
    });
  });

  const violations = [
    [`The sun-set was lovely`, `The sunset was lovely`],
    [`To-morrow foo`, `Tomorrow foo`],
    [`To-day bar`, `Today bar`],
    [`Foo to-day`, `Foo today`],
    [`Bed-side foo`, `Bedside foo`],
    [`Foo bed-side`, `Foo bedside`],
    [`Foo yoke-fellow`, `Foo yokefellow`],
    [`Foo yoke-mates`, `Foo yokemates`],
    [`Slave-holder foo`, `Slaveholder foo`],
    [`The slave-holders bar`, `The slaveholders bar`],
    [`By the road-side we`, `By the roadside we`],
    [`his death-bed was`, `his deathbed was`],
    [`in the day-time she`, `in the daytime she`],
    [`Have the pre-eminence`, `Have the preeminence`],
    [`He was pre-eminent`, `He was preeminent`],
    [`and reigned pre-eminently`, `and reigned preeminently`],
    [`death to re-enter and`, `death to reenter and`],
    [`He re-entered that nation`, `He reentered that nation`],
    [`* Re-enters Wales`, `* Reenters Wales`],
    [`re-establishing the discipline`, `reestablishing the discipline`],
    [`I have been re-examining`, `I have been reexamining`],
    [`She co-operated`, `She cooperated`],
    [`Co-operation was improved`, `Cooperation was improved`],
    [`foo anti-christ bar`, `foo antichrist bar`],
    [`foo anti-Christ bar`, `foo antichrist bar`],
    [`Anti-christ foo`, `Antichrist foo`],
    [`My fellow-creatures`, `My fellow creatures`],
    [`Fellow-creatures are`, `Fellow creatures are`],
    [`my fellow-servants`, `my fellow servants`],
    [`their faces Zion-ward,`, `their faces Zionward,`],
    [`faint-hearted foo`, `fainthearted foo`],
    [`broken-hearted foo`, `brokenhearted foo`],
    [`light-hearted foo`, `lighthearted foo`],
    [`foo inn-keeper\`'s bar`, `foo innkeeper\`'s bar`],
    [`the judgment-seat of`, `the judgment seat of`],
    [`some spiritually-minded people`, `some spiritually minded people`],
    [`Foo grand-child bar`, `Foo grandchild bar`],
    [`Foo grand-mothers bar`, `Foo grandmothers bar`],
    [`Foo grand-father bar`, `Foo grandfather bar`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = unhyphenedWords(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });

  const allowed = [[`To-dayfoo`], [`toto-daybar`]];

  test.each(allowed)(`%s is not a lint violation`, (line) => {
    expect(unhyphenedWords(line, [], 1, opts)).toHaveLength(0);
  });
});
