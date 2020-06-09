import stripIndent from 'strip-indent';
import leadingWhitespace from '../leading-whitespace';

const opts = { lang: `en` as const };

describe(`leadingWhitespace()`, () => {
  it(`creates a lint violation result for a line with leading whitespace`, () => {
    const results = leadingWhitespace(` Foo bar!`, [], 4, opts);
    expect(results).toHaveLength(1);
    expect(results[0]).toEqual({
      line: 4,
      column: 0,
      type: `error`,
      rule: `leading-whitespace`,
      message: `Lines should not have leading whitespace`,
      recommendation: `Foo bar!`,
      fixable: true,
    });
  });

  it(`does not lint error empty lines`, () => {
    const results = leadingWhitespace(``, [], 4, opts);
    expect(results).toHaveLength(0);
  });

  it(`only produces one lint for a chunk of leading whitespace`, () => {
    const results = leadingWhitespace(`   Foo.`, [], 1, opts);
    expect(results).toHaveLength(1);
    expect(results[0].column).toBe(0);
  });

  it(`allows leading whitespace in footnote poetry`, () => {
    const adoc = stripIndent(`
      Foobar.^
      footnote:[Here is a poem:
      \`    foo bar
           so much baz. \`
      and now the poem is done.]
    `).trim();
    const lines = adoc.split(`\n`);
    const results = leadingWhitespace(lines[3], lines, 4, opts);
    expect(results).toHaveLength(0);
  });

  it(`finds no violations in this chunk of real footnote poetry`, () => {
    const adoc = stripIndent(`
      Now began the priests to prophesy again,
      that within half a year we should be all put down and gone.^
      footnote:[The priests reckoned wrong in this, for, as Sewell justly observed,
      it fared with the early Friends as with trees, which grow best when most lopped.
      "\`Duris ut ilex tonsa bipennibus, per damna, per caedes, ab ipso,
      ducit opes aninumque ferre.\`"
      \`    "\`As by the lopping axe, the sturdy oak
           Improves her shade, and thrives beneath the stroke;
           Tho\`' present loss and wounds severe she feel,
           She draws fresh vigour from the invading steel.\`" \`]
      About two weeks after this I went into Walney island, and James Nayler went with me.
      We stayed one night at a little town on this side, called Cockan,
    `).trim();

    const lines = adoc.split(`\n`);
    lines.forEach((line, index) => {
      const results = leadingWhitespace(lines[index], lines, index + 1, opts);
      expect(results).toHaveLength(0);
    });
  });
});
