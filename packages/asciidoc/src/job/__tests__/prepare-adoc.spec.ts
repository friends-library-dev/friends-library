import stripIndent from 'strip-indent';
import { prepareAsciidoc } from '../prepare-adoc';

describe('prepareAsciidoc()', () => {
  it('swaps asterisms for html passthrough', () => {
    const adoc = stripIndent(`
      == Chapter 1

      Foobar.

      [.asterism]
      '''

      Foobar.
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain('<div class="asterism">');
    expect(prepared).not.toContain('<hr');
  });

  it('re-forms chapter-synopsis', () => {
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
    expect(prepared).not.toContain('*');
  });

  it('removes comments from chapter-synopsis', () => {
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

  it('changes markup for chapter-subtitle--blurb', () => {
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
      '++++\n<h3 class="chapter-subtitle--blurb">Foo bar baz</h3>\n++++',
    );
  });

  it('italicizes staring words of discourse-parts', () => {
    const adoc = stripIndent(`
      == Chapter 1

      [.discourse-part]
      Question: Foo bar?

      [.discourse-part]
      Answer: Hash baz.

      [.discourse-part]
      Answer 143: Hash baz.

      [.discourse-part]
      Objection: Qux!
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain('_Question:_');
    expect(prepared).toContain('_Answer:_');
    expect(prepared).toContain('_Answer 143:_');
    expect(prepared).toContain('_Objection:_');
  });

  const discretes = [
    ['blurb'],
    ['alt'],
    ['centered'],
    ['blurb.alt'],
    ['centered.alt'],
    ['blurb.centered'],
  ];

  test.each(discretes)('it makes headers with certain classes discrete', kls => {
    const adoc = `== Ch\n\n[.${kls}]\n=== H3\n\n[.${kls}]\n==== H4`;

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(`[discrete.${kls}]\n=== H3`);
    expect(prepared).toContain(`[discrete.${kls}]\n==== H4`);
  });

  const headingsInOpenBlocks = [
    ['== Ch1\n\n[.embedded-content-document]\n--\n\n=== Foo\n\n--\n'],
    ['== Ch1\n\n[.embedded-content-document]\n--\n\n[.blurb]\n=== Foo\n\n--\n'],
    ['== Ch1\n\n[.embedded-content-document]\n--\n\n[.foo]\n=== Foo\n\n--\n'],
  ];

  test.each(headingsInOpenBlocks)('heading in open block is discrete', adoc => {
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toMatch(/\[discrete(\.(foo|blurb))?\]\n=== Foo/m);
  });

  test('verse lines ending with emdash not joined', () => {
    const adoc = stripIndent(`
      == C1

      [verse]
      ____
      Foo bar;--
      So much baz!
      ____
    `).trim();

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain('Foo bar;&#8212;\nSo much baz!');
  });

  test('emdash before booktitle', () => {
    const adoc = '== C1\n\nFoo^\nfootnote:[--[.book-title]#Apology#]\nbar.';

    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain(
      'footnote:[&#8212;+++<span class="book-title">+++Apology+++</span>+++',
    );
  });

  it('correctly handles unencoded actual emdashes in source asciidoc', () => {
    const adoc = '== C1\n\nFoo—bar.';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('Foo&#8212;bar.');
  });

  it('converts to curly quotes', () => {
    const prepared = prepareAsciidoc('== Ch1\n\nHello "`good`" sir.');
    expect(prepared).toContain('Hello &#8220;good&#8221; sir.');
  });

  it('converts curly apostrophes', () => {
    const prepared = prepareAsciidoc("== Ch1\n\nHello '`good`' sir.");
    expect(prepared).toContain('Hello &#8216;good&#8217; sir.');
  });

  it('inserts emdash before .signed-section-signature', () => {
    // using css content::before doesn't work on mobi-7
    const adoc = '== Ch\n\nFoo.\n\n[.signed-section-signature]\nJared.';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('&#8212;Jared.');
  });

  test('open block delimiters not changed into emdash', () => {
    const adoc = '== C1\n\n[.embedded-content-document]\n--\n\nFoo, bar.\n\n--\n';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('[.embedded-content-document]\n--\n\n');
    expect(prepared).toContain('\n\n--\n');
  });

  const emdashSplits = [
    ['== Ch\n\nFoo bar--\nan aside--\njim jam.', 'bar&#8212;an aside&#8212;jim'],
    ['== Ch\n\n"The earth,`"--\nHe says.', '&#8212;He'],
  ];

  it.each(emdashSplits)(
    'trims spaces when joining lines with emdash in between',
    (adoc, frag) => {
      const prepared = prepareAsciidoc(adoc);
      expect(prepared).toContain(frag);
    },
  );

  it('trims spaces when joining quoted lines with emdash in between', () => {
    const adoc = '== Ch\n\n"`Foo bar`"--\n"`jim jam.`"';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('bar&#8221;&#8212;&#8220;jim');
  });

  it('self-corrects problematic italics after emdash', () => {
    const adoc = '== C1\n\nFoo--_bar_. Beep--\n_boop_ baz.';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('Foo&#8212;__bar__.');
    expect(prepared).toContain('Beep&#8212;__boop__ baz.');
  });

  it('removes linebreak and caret preceding footnote references', () => {
    const adoc = '== Ch\n\nA caret^\nfootnote:[lol].';
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('A caretfootnote:[lol].');
  });

  it('replaces hr.small-break with custom markup', () => {
    const adoc = "== Ch1\n\nPara.\n\n[.small-break]\n'''\n\nPara.";
    const prepared = prepareAsciidoc(adoc);
    expect(prepared).toContain('++++\n<div class="small-break">');
    expect(prepared).not.toContain('[.small-break]');
  });

  test('caret-style footnote after inline class gets {blank} helper', () => {
    const adoc =
      '== C1\n\nFoo [.book-title]#bar#^\nfootnote:[jim +++[+++jam+++]+++.]\nis baz.';
    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain('[.book-title]#bar#{blank}footnote:[jim');
  });

  test('book-title inside footnote on book-title gets {blank} helper', () => {
    const adoc = stripIndent(`
      == C1

      I was reading [.book-title]#Sewell#^
      footnote:[[.book-title]#Sewells History#]
      yesterday.
    `).trim();
    const prepared = prepareAsciidoc(adoc);

    expect(prepared).toContain('[.book-title]#Sewell#{blank}footnote:[[.book-title]');
  });
});