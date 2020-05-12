import stripIndent from 'strip-indent';
import processDocument from '../process-document';

let mockCounter = 0;

jest.mock('uuid/v4', () => {
  return jest.fn(() => `uuid${++mockCounter}`);
});

describe('createSourceSpec()', () => {
  beforeEach(() => {
    mockCounter = 0;
  });

  it('turns adoc chapters into sections', () => {
    const { sections } = processDocument('== Ch1\n\nPara1.\n\n== Ch 2\n\nPara2.\n');
    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe('section1');
    expect(sections[1].id).toBe('section2');
  });

  it('entity followed by semicolon does not produce <dl>', () => {
    const { sections } = processDocument("== Ch1\n\nStayed at R. Jones`';");
    expect(sections[0].html).not.toContain('<dl>');
  });

  test('custom classes dont mess up sectioning', () => {
    const { sections } = processDocument(
      '== Ch1\n\nPara1.\n\n[.style-foo]\n== Ch 2\n\nPara2.\n',
    );
    expect(sections).toHaveLength(2);
  });

  it('placeholders chapter headings', () => {
    const {
      sections: [section],
    } = processDocument('== Ch1\n\nPara1.');

    expect(section.html).toContain('{% chapter-heading %}');
    expect(section.html).not.toContain('Ch1');
    expect(section.html).not.toContain('h2');
  });

  it('transfers heading style class to placeholder', () => {
    const adoc = '[.style-blurb]\n== Title\n\nPara.';
    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.html).toContain('{% chapter-heading, blurb %}');
    expect(section.html).not.toContain(' style-blurb'); // interferes with `first-chapter`
  });

  it('transfers heading style class to placeholder, even with id', () => {
    const adoc = '[#foo.style-lol, short="Foo"]\n== Title\n\nPara.';
    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.html).toContain('{% chapter-heading, lol %}');
  });

  it('extracts heading short text from adoc', () => {
    const adoc = '[#intro, short="Intro"]\n== Introduction\n\nPara.';
    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.heading).toMatchObject({
      id: 'intro',
      text: 'Introduction',
      shortText: 'Intro',
    });
  });

  it('extracts short heading from adoc when id also has class', () => {
    const adoc = '[#intro.style-foo, short="Intro"]\n== Introduction\n\nPara.';
    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.heading.shortText).toBe('Intro');
  });

  it('extracts footnotes', () => {
    const { sections, notes } = processDocument('== Ch\n\nA caret^\nfootnote:[lol].');

    expect(sections[0].html).toContain('<p>A caret{% note: uuid1 %}.</p>');
    expect(sections).toHaveLength(1);
    expect(notes.get('uuid1')).toEqual('lol');
  });

  it('allows footnotes on chapter-synopsis items', () => {
    const adoc = '== C1\n\n[.chapter-synopsis]\n* foofootnote:[bar]\n* baz\n\n';
    const { notes } = processDocument(adoc);
    expect(notes.get('uuid1')).toBe('bar');
  });

  it('adds m7 breaks to .offset sections', () => {
    const adoc = '== Ch1\n\n[.offset]\nFoo.';
    const {
      sections: [section],
    } = processDocument(adoc);
    expect(section.html).toContain('<br class="m7"/><p>Foo.</p>\n<br class="m7"/>');
  });

  test('blockquote tag gets mobi-7 br tag', () => {
    const adoc = '== C1\n\n[quote]\n____\nFoo.\n____';
    const {
      sections: [section],
    } = processDocument(adoc);
    expect(section.html).toContain('<blockquote><br class="m7"/>');
  });

  it('adds m7 break to top of .discourse-part sections', () => {
    const adoc = '== Ch1\n\n[.discourse-part]\nFoo.';
    const {
      sections: [section],
    } = processDocument(adoc);
    expect(section.html).toContain('<div class="discourse-part"><br class="m7"/>');
  });

  test('caret-style footnote after inline class works', () => {
    const adoc = stripIndent(`
      == C1

      Foo [.book-title]#bar#^
      footnote:[jim +++[+++jam+++]+++.]
      is baz.
    `).trim();

    const {
      sections: [section],
      notes,
    } = processDocument(adoc);

    expect(section.html).toContain(
      '<span class="book-title">bar</span>{% note: uuid1 %}',
    );
    expect(notes.get('uuid1')).toBe('jim &#91;jam&#93;.');
  });

  test('book-title inside footnote on book-title works', () => {
    const adoc = stripIndent(`
      == C1
      
      I was reading [.book-title]#Sewell#^
      footnote:[[.book-title]#Sewells History#]
      yesterday.
    `).trim();

    const {
      sections: [section],
      notes,
    } = processDocument(adoc);

    expect(section.html).not.toContain('#Sewells History#]');
    expect(notes.get('uuid1')).toBe('<span class="book-title">Sewells History</span>');
  });

  test('emdash before booktitle', () => {
    const adoc = '== C1\n\nFoo^\nfootnote:[--[.book-title]#title#]\nbar.';

    const {
      sections: [section],
      notes,
    } = processDocument(adoc);

    expect(section.html).toContain('Foo{% note: uuid1 %}\nbar.');
    expect(notes.get('uuid1')).toBe('&#8212;<span class="book-title">title</span>');
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

    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.html).toContain('>Foo bar;&#8212;<');
    expect(section.html).toContain('>So much baz!<');
  });

  const removeParagraphClass = [
    'salutation',
    'discourse-part',
    'offset',
    'the-end',
    'letter-participants',
    'signed-section-signature',
    'signed-section-closing',
    'signed-section-context-open',
    'signed-section-context-close',
  ];

  test.each(removeParagraphClass)('it removes the .paragraph class on div.%s', kls => {
    const adoc = `== Ch1\n\n[.${kls}]\nFoobar.`;

    const {
      sections: [section],
    } = processDocument(adoc);

    expect(section.html).toContain(`<div class="${kls}">`);
    expect(section.html).not.toContain('paragraph');
  });

  test('.old-style headings are broken up into custom markup', () => {
    const adoc = '== Ch 1\n\n[.old-style]\n=== Foo / Bar / Baz\n\nPara.';

    const {
      sections: [section],
    } = processDocument(adoc);

    const expected = `
      <h3 id="_foo_bar_baz" class="old-style">
        <span>Foo <br class="m7"/></span>
        <span><em>Bar</em> <br class="m7"/></span>
        <span><em>Baz</em></span>
      </h3>
    `.replace(/\s\s+/gm, '');

    expect(section.html).toContain(expected);
  });

  test('.old-style.bold headings are broken up into custom markup', () => {
    const adoc = '== C1\n\n[.old-style.bold]\n=== Foo / Bar / Baz\n\nPara.';

    const {
      sections: [section],
    } = processDocument(adoc);

    const expected = `
      <h3 id="_foo_bar_baz" class="old-style bold">
        <span>Foo <br class="m7"/></span>
        <span><em>Bar</em> <br class="m7"/></span>
        <span><em>Baz</em></span>
      </h3>
    `.replace(/\s\s+/gm, '');

    expect(section.html).toContain(expected);
  });

  test('adds classes signifying if chapters have signed (letter) chunks', () => {
    const adoc = '== C1\n\nPara.\n\n== C2\n\n[.salutation]\nDear Friend,';

    const {
      sections: [sect1, sect2],
    } = processDocument(adoc);

    expect(sect1.html).toMatch(/^<div class="sect1 chapter--no-signed-section"/);
    expect(sect2.html).toMatch(/^<div class="sect1 chapter--has-signed-section"/);
  });

  it('replaces asciidoctor verseblock markup with custom markup', () => {
    const adoc = stripIndent(`
      == A Poem

      [verse]
      ____
      Foo bar,
      So much baz,
      Foo bar and baz.
      ____
    `).trim();

    const {
      sections: [section],
    } = processDocument(adoc);

    const expected = stripIndent(`
      <div class="verse">
      <div class="verse__line">Foo bar,</div>
      <div class="verse__line">So much baz,</div>
      <div class="verse__line">Foo bar and baz.</div>
      </div>
    `).trim();

    expect(section.html).toContain(expected);
    expect(section.html).not.toContain('verseblock');
    expect(section.html).not.toContain('<pre class="content">');
  });

  it('wraps poetry stanzas', () => {
    const adoc = stripIndent(`
      == A Poem

      [verse]
      ____
      Foo bar,
      So much baz.

      Foo bar,
      and baz.
      ____
    `).trim();

    const {
      sections: [section],
    } = processDocument(adoc);

    const expected = stripIndent(`
      <div class="verse">
      <div class="verse__stanza">
      <div class="verse__line">Foo bar,</div>
      <div class="verse__line">So much baz.</div>
      </div>

      <div class="verse__stanza">
      <div class="verse__line">Foo bar,</div>
      <div class="verse__line">and baz.</div>
      </div>
      </div>
    `).trim();

    expect(section.html).toContain(expected);
    expect(section.html).not.toContain('verseblock');
    expect(section.html).not.toContain('<pre class="content">');
  });

  it('converts made-up syntax for poetry in footnotes', () => {
    const adoc = `
== Chapter

Hash baz.^
footnote:[Foo bar.
\`    Foo bar,
     So much baz.
     - - - - - -
     Foo bar
     And baz.  \`
End of footnote here.]
    `.trim();

    const { notes } = processDocument(adoc);

    const expected = stripIndent(`
      <span class="verse"><br class="m7"/>
      <span class="verse__stanza">
      <span class="verse__line"><br class="m7"/>Foo bar,</span>
      <span class="verse__line"><br class="m7"/>So much baz.</span>
      </span>
      <span class="verse__stanza">
      <span class="verse__line"><br class="m7"/>Foo bar</span>
      <span class="verse__line"><br class="m7"/>And baz.</span>
      </span>
      </span>
    `).trim();

    expect(notes.get('uuid1')).toContain(expected);
    expect(notes.get('uuid1')).not.toContain('`');
    expect(notes.get('uuid1')).not.toContain('- -');
  });

  it('adds special markup for faux multi-paragraph footnotes', () => {
    const adoc = stripIndent(`
      == Chapter 1

      Foo.^
      footnote:[Jim jam.
      Foo bar.
      {footnote-paragraph-split}
      Hash baz.]
    `).trim();

    const { notes } = processDocument(adoc);

    const splitMarkup = '<span class="fn-split"><br class="m7"/><br class="m7"/></span>';
    expect(notes.get('uuid1')).toContain(`bar. ${splitMarkup} Hash`);
  });
});
