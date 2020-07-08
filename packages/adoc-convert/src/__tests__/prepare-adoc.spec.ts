import stripIndent from 'strip-indent';
import { prepareAsciidoc } from '../prepare-adoc';

describe(`prepareAsciidoc()`, () => {
  it(`converts escaped square brackets to entity, to avoid footnote problems`, () => {
    const adoc = stripIndent(`
      [.centered]
      Foo +++[+++bar+++]+++ baz.^
      footnote:[jim +++[+++jam+++]+++ bob.]
    `).trim();

    const expected = stripIndent(`
      [.centered]
      Foo &#91;bar&#93; baz.footnote:[jim &#91;jam&#93; bob.]
    `).trim();

    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toBe(expected);
  });

  it(`escapes entity+semicolon to prevent creating definition list`, () => {
    const adoc = `== Ch 1\n\nStayed at R. Jones\`';\n\nLeft next day.`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`&#8217;+++;+++`);
  });

  it(`swaps asterisms for html passthrough`, () => {
    const adoc = stripIndent(`
      == Chapter 1

      Foobar.

      [.asterism]
      '''

      Foobar.
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`<div class="asterism">`);
    expect(prepared).not.toContain(`<hr`);
  });

  it(`re-forms chapter-synopsis`, () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.chapter-synopsis]
      * foo
      * bar
      * baz

      Para.
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    const expected = stripIndent(`
      [.chapter-synopsis]
      foo&#8212;bar&#8212;baz

    `).trim();
    expect(prepared).toContain(`${expected}\n\n`);
    expect(prepared).not.toContain(`*`);
  });

  it(`removes comments from chapter-synopsis`, () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.chapter-synopsis]
      * foo
      // bar
      * baz

      Para.
    `).trim();

    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`foo&#8212;baz`);
  });

  it(`changes markup for chapter-subtitle--blurb`, () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.chapter-subtitle--blurb]
      Foo
      bar
      baz

      Para.
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(
      `++++\n<h3 class="chapter-subtitle--blurb">Foo bar baz</h3>\n++++`,
    );
  });

  const psCases = [
    // english
    [`P+++.+++ S. Foo`, `_P+++.+++ S._ Foo`],
    [`P. S. Bar`, `_P. S._ Bar`],
    [`PS: Bar`, `_PS:_ Bar`],
    [`P. S.--Bar`, `_P. S._&#8212;Bar`],
    [`P. S.Bar`, `_P. S._Bar`],
    [`P.S. Bar`, `_P.S._ Bar`],
    [`PS Bar`, `_PS_ Bar`],
    [`PS. Bar`, `_PS._ Bar`],
    [`Postscript Foobar`, `_Postscript_ Foobar`],
    [`Postscript. Foobar`, `_Postscript._ Foobar`],
    [`PostScript Foobar`, `_PostScript_ Foobar`],
    [`N+++.+++ B. Foo`, `_N+++.+++ B._ Foo`],
    [`N+++.+++B. Foo`, `_N+++.+++B._ Foo`],
    [`NB: Foo`, `_NB:_ Foo`],
    [`N.B. Bar`, `_N.B._ Bar`],
    // spanish
    [`P+++.+++ D. Foo`, `_P+++.+++ D._ Foo`],
    [`P. D. Bar`, `_P. D._ Bar`],
    [`PD: Bar`, `_PD:_ Bar`],
    [`P. D.--Bar`, `_P. D._&#8212;Bar`],
    [`P. D.Bar`, `_P. D._Bar`],
    [`P.D. Bar`, `_P.D._ Bar`],
    [`PD Bar`, `_PD_ Bar`],
    [`PD. Bar`, `_PD._ Bar`],
    [`Posdata Foobar`, `_Posdata_ Foobar`],
    [`Posdata. Foobar`, `_Posdata._ Foobar`],
    [`PosData Foobar`, `_PosData_ Foobar`],
  ];

  test.each(psCases)(`PS start %s should become %s`, (before, after) => {
    const adoc = stripIndent(`
      == Chapter 1

      [.postscript]
      ====

      ${before}

      ====
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(after);
  });

  it(`italicizes staring words of English discourse-parts`, () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.discourse-part]
      Question: Foo bar?

      [.discourse-part]
      Question. After period,

      [.discourse-part]
      Answer:
      Next line.

      [.discourse-part]
      Answer: Hash baz.

      [.discourse-part]
      Answer 143: Hash baz.

      [.discourse-part]
      Objection: Qux!

      [.discourse-part]
      Objection.
      Foobar

      [.discourse-part]
      Inquiry 13: Foo
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`_Question:_ Foo bar?`);
    expect(prepared).toContain(`_Question._ After period,`);
    expect(prepared).toContain(`_Answer:_ Hash baz.`);
    expect(prepared).toContain(`_Answer:_\nNext line.`);
    expect(prepared).toContain(`_Answer 143:_`);
    expect(prepared).toContain(`_Objection:_ Qux!`);
    expect(prepared).toContain(`_Objection._\nFoobar`);
    expect(prepared).toContain(`_Inquiry 13:_`);
  });

  it(`italicizes staring words of Spanish discourse-parts`, () => {
    const adoc = stripIndent(`
      == Chapter 1 Pregunta, Answer is Respuesta, Objection is Objeción

      [.discourse-part]
      Pregunta: Foo bar?

      [.discourse-part]
      Respuesta: Hash baz.

      [.discourse-part]
      Respuesta 143: Hash baz.

      [.discourse-part]
      Objeción: Qux!
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`_Pregunta:_`);
    expect(prepared).toContain(`_Respuesta:_`);
    expect(prepared).toContain(`_Respuesta 143:_`);
    expect(prepared).toContain(`_Objeción:_`);
  });

  const discretes = [
    [`blurb`],
    [`alt`],
    [`centered`],
    [`blurb.alt`],
    [`centered.alt`],
    [`blurb.centered`],
  ];

  test.each(discretes)(`it makes headers with certain classes discrete`, kls => {
    const adoc = `== Ch\n\n[.${kls}]\n=== H3\n\n[.${kls}]\n==== H4`;

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`[discrete.${kls}]\n=== H3`);
    expect(prepared).toContain(`[discrete.${kls}]\n==== H4`);
  });

  const headingsInOpenBlocks = [
    [`== Ch1\n\n[.embedded-content-document]\n--\n\n=== Foo\n\n--\n`],
    [`== Ch1\n\n[.embedded-content-document]\n--\n\n[.blurb]\n=== Foo\n\n--\n`],
    [`== Ch1\n\n[.embedded-content-document]\n--\n\n[.foo]\n=== Foo\n\n--\n`],
  ];

  test.each(headingsInOpenBlocks)(`heading in open block is discrete`, adoc => {
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toMatch(/\[discrete(\.(foo|blurb))?\]\n=== Foo/m);
  });

  test(`verse lines ending with emdash not joined`, () => {
    const adoc = stripIndent(`
      == C1

      [verse]
      ____
      Foo bar;--
      So much baz!
      ____
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`Foo bar;&#8212;\nSo much baz!`);
  });

  test(`emdash before booktitle`, () => {
    const adoc = `== C1\n\nFoo^\nfootnote:[--[.book-title]#Apology#]\nbar.`;

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(
      `footnote:[&#8212;+++<span class="book-title">+++Apology+++</span>+++`,
    );
  });

  it(`correctly handles unencoded actual emdashes in source asciidoc`, () => {
    const adoc = `== C1\n\nFoo—bar.`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`Foo&#8212;bar.`);
  });

  it(`converts to curly quotes`, () => {
    const prepared = prepareAsciidoc(`== Ch1\n\nHello "\`good\`" sir.`);
    expect(prepared).toContain(`Hello &#8220;good&#8221; sir.`);
  });

  it(`converts curly apostrophes`, () => {
    const prepared = prepareAsciidoc(`== Ch1\n\nHello '\`good\`' sir.`);
    expect(prepared).toContain(`Hello &#8216;good&#8217; sir.`);
  });

  it(`inserts emdash before .signed-section-signature`, () => {
    // using css content::before doesn't work on mobi-7
    const adoc = `== Ch\n\nFoo.\n\n[.signed-section-signature]\nJared.`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`&#8212;Jared.`);
  });

  test(`open block delimiters not changed into emdash`, () => {
    const adoc = `== C1\n\n[.embedded-content-document]\n--\n\nFoo, bar.\n\n--\n`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`[.embedded-content-document]\n--\n\n`);
    expect(prepared).toContain(`\n\n--\n`);
  });

  const emdashSplits = [
    [`== Ch\n\nFoo bar--\nan aside--\njim jam.`, `bar&#8212;an aside&#8212;jim`],
    [`== Ch\n\n"The earth,\`"--\nHe says.`, `&#8212;He`],
  ];

  it.each(emdashSplits)(
    `trims spaces when joining lines with emdash in between`,
    (adoc, frag) => {
      const prepared = prepareAsciidoc(adoc);
      expect(prepared).toContain(frag);
    },
  );

  it(`trims spaces when joining quoted lines with emdash in between`, () => {
    const adoc = `== Ch\n\n"\`Foo bar\`"--\n"\`jim jam.\`"`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`bar&#8221;&#8212;&#8220;jim`);
  });

  it(`removes linebreak and caret preceding footnote references`, () => {
    const adoc = `== Ch\n\nA caret^\nfootnote:[lol].`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`A caretfootnote:[lol].`);
  });

  it(`replaces hr.small-break with custom markup`, () => {
    const adoc = `== Ch1\n\nPara.\n\n[.small-break]\n'''\n\nPara.`;
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain(`++++\n<div class="small-break">`);
    expect(prepared).not.toContain(`[.small-break]`);
  });

  test(`caret-style footnote after inline class gets {blank} helper`, () => {
    const adoc = `== C1\n\nFoo [.book-title]#bar#^\nfootnote:[jim +++[+++jam+++]+++.]\nis baz.`;
    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`[.book-title]#bar#{blank}footnote:[jim`);
  });

  test(`book-title inside footnote on book-title gets {blank} helper`, () => {
    const adoc = stripIndent(`
      == C1

      I was reading [.book-title]#Sewell#^
      footnote:[[.book-title]#Sewells History#]
      yesterday.
    `).trim();
    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`[.book-title]#Sewell#{blank}footnote:[[.book-title]`);
  });

  const entities = [[`Foo bar&hellip;`, `Foo bar&#8230;`]];

  test.each(entities)(`converts %s to %s`, (before, after) => {
    const prepared = prepareAsciidoc(before);
    expect(prepared).toBe(after);
  });
});
