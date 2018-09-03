import { prepare } from '../prepare';
import { testPrecursor as precursor } from '../test-helpers';

let mockCounter = 0;

jest.mock('uuid/v4', () => {
  return jest.fn(() => `uuid${++mockCounter}`);
});


describe('prepare()', () => {
  beforeEach(() => {
    mockCounter = 0;
  });

  it('turns adoc chapters into sections', () => {
    const { sections } = prepare(precursor('== Ch1\n\nPara1.\n\n== Ch 2\n\nPara2.\n'));

    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe('section1');
    expect(sections[1].id).toBe('section2');
  });

  test('custom classes dont mess up sectioning', () => {
    const { sections } = prepare(precursor('== Ch1\n\nPara1.\n\n[.style-foo]\n== Ch 2\n\nPara2.\n'));

    expect(sections).toHaveLength(2);
  });

  it('placeholders chapter headings', () => {
    const { sections: [section] } = prepare(precursor('== Ch1\n\nPara1.'));

    expect(section.html).toContain('{% chapter-heading %}');
    expect(section.html).not.toContain('Ch1');
    expect(section.html).not.toContain('h2');
  });

  it('trims spaces when joining lines with emdash in between', () => {
    const adoc = '== Ch\n\nFoo bar--\nan aside--\njim jam.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('bar&#8212;an aside&#8212;jim');
  });

  it('corrects for improperly broken quotes', () => {
    const adoc = '== Ch\n\nFoo bar "`\njim jam.`"';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('&#8220;jim jam.&#8221;');
  });

  it('trims spaces when joining quoted lines with emdash in between', () => {
    const adoc = '== Ch\n\n"`Foo bar`"--\n"`jim jam.`"';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('bar&#8221;&#8212;&#8220;jim');
  });

  it('transfers heading style class to placeholder', () => {
    const adoc = '[.style-blurb]\n== Title\n\nPara.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('{% chapter-heading, blurb %}');
    expect(section.html).not.toContain(' style-blurb'); // interferes with `first-chapter`
  });

  it('transfers heading style class to placeholder, even with id', () => {
    const adoc = '[#foo.style-lol, short="Foo"]\n== Title\n\nPara.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('{% chapter-heading, lol %}');
  });

  it('extracts heading short text from adoc', () => {
    const adoc = '[#intro, short="Intro"]\n== Introduction\n\nPara.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.heading).toMatchObject({
      id: 'intro',
      text: 'Introduction',
      shortText: 'Intro',
    });
  });

  it('extracts short heading from adoc when id also has class', () => {
    const adoc = '[#intro.style-foo, short="Intro"]\n== Introduction\n\nPara.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.heading.shortText).toBe('Intro');
  });

  it('extracts epigraphs', () => {
    const adoc = `
[quote.epigraph, , Cite1]
____
Quote #1
____

[quote.epigraph]
____
Quote #2
____

== A Chapter Heading

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor.
    `.trim();

    const { epigraphs, sections } = prepare(precursor(adoc));

    expect(epigraphs).toHaveLength(2);
    expect(epigraphs[0].source).toBe('Cite1');
    expect(epigraphs[0].text).toBe('Quote #1');
    expect(epigraphs[1].source).toBeUndefined();
    expect(epigraphs[1].text).toBe('Quote #2');
    expect(sections[0].html).not.toContain('epigraph');
  });

  it('replaces asciidoctor verseblock markup with custom markup', () => {
    const adoc = `
== A Poem

[verse]
____
Foo bar,
So much baz,
Foo bar and baz.
____
    `.trim();

    const { sections: [section] } = prepare(precursor(adoc));

    const expected = `
<div class="verse">
<div class="verse__line">Foo bar,</div>
<div class="verse__line">So much baz,</div>
<div class="verse__line">Foo bar and baz.</div>
</div>
    `.trim();

    expect(section.html).toContain(expected);
    expect(section.html).not.toContain('verseblock');
    expect(section.html).not.toContain('<pre class="content">');
  });

  it('converts to curly quotes', () => {
    const { sections } = prepare(precursor('== Ch1\n\nHello "`good`" sir.'));

    expect(sections[0].html).toContain('Hello &#8220;good&#8221; sir.');
  });

  it('converts curly apostrophes', () => {
    const { sections } = prepare(precursor("== Ch1\n\nHello '`good`' sir."));

    expect(sections[0].html).toContain('Hello &#8216;good&#8217; sir.');
  });

  it('removes linebreak and caret preceding footnote references', () => {
    const { sections } = prepare(precursor('== Ch\n\nA caret^\nfootnote:[lol].'));

    expect(sections[0].html).toContain('caret{% note:');
  });

  it('extracts footnotes', () => {
    const { sections, notes } = prepare(precursor('== Ch\n\nA caret^\nfootnote:[lol].'));

    expect(sections[0].html).toContain('<p>A caret{% note: uuid1 %}.</p>');
    expect(sections).toHaveLength(1);
    expect(notes.get('uuid1')).toEqual('lol');
  });

  it('swaps asterisms for html passthrough', () => {
    const adoc = `
== Chapter 1

Foobar.

[.asterism]
'''

Foobar.
    `;
    const { sections: [sect1] } = prepare(precursor(adoc));

    expect(sect1.html).toContain('<div class="asterism"');
    expect(sect1.html).not.toContain('<hr');
  });

  it('removes paragraph class off certain divs', () => {
    const adoc = '== Ch\n\n[.signed-section-signature]\nFoo.';
    const { sections: [section] } = prepare(precursor(adoc));

    expect(section.html).toContain('class="signed-section-signature"');
  });

  it('re-forms chapter-synopsis', () => {
    const adoc = `
== Chapter 1

[.chapter-synopsis]
* foo
* bar
* baz

Para.
    `.trim();

    const { sections: [section] } = prepare(precursor(adoc));

    const expected = '<p class="chapter-synopsis">foo&#8212;bar&#8212;baz</p>';
    expect(section.html).toContain(expected);
    expect(section.html).not.toContain('<ul');
  });
});
