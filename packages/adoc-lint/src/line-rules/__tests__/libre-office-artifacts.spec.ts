import libreOfficeArtifacts from '../libre-office-artifacts';

const opts = { lang: `en` as const };

describe(`libreOfficeArtifacts()`, () => {
  it(`creates a lint for violation of \`libre-office-artifacts\` rule`, () => {
    const results = libreOfficeArtifacts(`Foo +++[++++++[+++_abc23]]bar`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 5,
      type: `error`,
      rule: `libre-office-artifacts`,
      message: `Libre Office ref artifacts must be removed`,
      fixable: true,
      recommendation: `Foo bar`,
    });
  });

  const violations: [string, string][] = [
    [
      `Paul says, +++[++++++[+++_dlps]]the woman being deceived,`,
      `Paul says, the woman being deceived,`,
    ],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = libreOfficeArtifacts(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
  });
});
