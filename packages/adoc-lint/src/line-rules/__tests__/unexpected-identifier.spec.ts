import unxpectedIdentifier from '../unexpected-identifier';

const opts = { lang: `en` as const };

describe(`unxpectedIdentifier()`, () => {
  it(`creates a lint for violation of \`unxpected-identifier\` rule`, () => {
    const results = unxpectedIdentifier(`[no-indent]`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 1,
      column: 2,
      type: `error`,
      rule: `unexpected-identifier`,
      message: `"no-indent" is not a known identifier, did you mean ".no-indent"?`,
    });
  });

  const violations: [string][] = [
    [`[#chap4.not-real]`],
    [`[quote.slapigraph, , Ps. 101]`],
  ];

  test.each(violations)(`\`%s\` should become "%s"`, line => {
    const results = unxpectedIdentifier(line, [], 1, opts);
    expect(results).toHaveLength(1);
  });

  const allowed: [string][] = [
    [`[quote.scripture, , Ps. 101]`],
    [`[#chap4, short="Foobar"]`],
    [`[#chap4.style-blurb, short="Foobar"]`],
    [`[.centered.alt]`],
    [`[.alt.centered]`],
    [`[.centered.offset.emphasized]`],
    [`[.signed-section-closing]`],
    [`[.chapter-subtitle--blurb]`],
    [`[.embedded-content-document]`],
    [`[.embedded-content-document.epistle]`],
    [`[cols="3,3,2"]`],
  ];

  test.each(allowed)(`%s is not a lint violation`, line => {
    expect(unxpectedIdentifier(line, [], 1, opts)).toHaveLength(0);
  });
});
