import { prepare } from '../spec';
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

  it('placeholders chapter headings', () => {
    const { sections: [section] } = prepare(precursor('== Ch1\n\nPara1.'));

    expect(section.html).toContain('{% chapter-heading %}');
    expect(section.html).not.toContain('Ch1');
    expect(section.html).not.toContain('h2');
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
});
