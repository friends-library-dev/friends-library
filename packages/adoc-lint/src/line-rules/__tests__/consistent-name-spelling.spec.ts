import consistentNameSpelling from '../consistent-name-spelling';

const opts = { lang: `en` as const };

describe(`consistentNameSpelling()`, () => {
  it(`creates a lint for violation of \`consistent-name-spelling\` rule`, () => {
    const results = consistentNameSpelling(`James Naylor and I`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 11,
      fixable: true,
      type: `error`,
      rule: `consistent-name-spelling`,
      recommendation: `James Nayler and I`,
      message: `James Nayler's last name must always be spelled "Nayler"`,
    });
  });

  it(`finds catharine payton across two lines`, () => {
    const adoc = `Went to meeting with Catharine\nPayton who`;
    const lines = adoc.split(`\n`);
    const results = consistentNameSpelling(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].fixable).toBe(false);
  });

  it(`correctly supplies recommendation for CP without doubling nextline word`, () => {
    const adoc = `Went to meeting with Catharine Payton\nwho`;
    const lines = adoc.split(`\n`);
    const results = consistentNameSpelling(lines[0], lines, 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].fixable).toBe(true);
    // no `who` from next line caused by `lint.includeNextLineFirstWord`
    expect(results[0].recommendation).toBe(`Went to meeting with Catherine Payton`);
  });

  const violations: [string, string][] = [
    [`By the preaching of James Naylor`, `By the preaching of James Nayler`],
    [`Catharine Payton came to meeting`, `Catherine Payton came to meeting`],
    [`Foo Mount Mellick`, `Foo Mountmellick`],
    [`Foo Mount-Mellick`, `Foo Mountmellick`],
    [`Foo Mount-melick`, `Foo Mountmellick`],
    [`Foo Mount-melic`, `Foo Mountmellick`],
    [`Foo Mountmelic`, `Foo Mountmellick`],
    [`Foo Mountmellic`, `Foo Mountmellick`],
    [`Foo Mount-Melick`, `Foo Mountmellick`],
    [`Foo Mount melick`, `Foo Mountmellick`],
    [`Foo Mount-mellick`, `Foo Mountmellick`],
    [`Foo Mount Melick`, `Foo Mountmellick`],
    [`Foo Mountmelick`, `Foo Mountmellick`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, (line, reco) => {
    const results = consistentNameSpelling(line, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].recommendation).toBe(reco);
    expect(results[0].fixable).toBe(true);
  });

  const allowed: [string][] = [
    [`By the preaching of James Nayler`],
    [`Sir Isaac Pennington, Sr.`],
    [`Pennington Sr. was tried for treason`],
    [`Came to Mountmellick for a meeting`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(consistentNameSpelling(line, [], 1, opts)).toHaveLength(0);
  });
});
