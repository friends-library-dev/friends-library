import { divide } from '../divide';
import { convert } from '../asciidoc';
import { M7BR } from '../../epub/index';

describe('divide()', () => {
  let config;

  beforeEach(() => {
    config = {};
  });

  it('divides by chapters', () => {
    const html = convert('== Ch1\n\nPara1.\n\n== Ch2\n\nPara2.\n');
    const sections = divide(html, config);

    expect(sections.length).toBe(2);
    expect(sections[0].html).toContain('>Ch1</h2>');
    expect(sections[1].html).toContain('>Ch2</h2>');
    expect(sections[0].title).toBe('Ch1');
    expect(sections[1].title).toBe('Ch2');
    expect(sections[0].ref).toBe('_ch1');
    expect(sections[1].ref).toBe('_ch2');
  });

  it('adds id property', () => {
    const adoc = '== Ch1\n\nPara1.\n\n== Ch2\n\nPara2.footnote:[lol]\n';
    const html = convert(adoc);
    const [one, two, notes] = divide(html, config);

    expect(one.id).toBe('sect1');
    expect(two.id).toBe('sect2');
    expect(notes.id).toBe('notes');
  });

  it('puts footnotes into own section', () => {
    const html = convert('== Ch1\n\nA para.footnote:[lol]</>');
    const sections = divide(html, config);

    expect(sections.length).toBe(2);
    expect(sections[1].html).toMatch(/^\s*<div id="footnotes">/);
  });

  it('prepends resource file to footnote hash hrefs', () => {
    const html = convert('== Ch1\n\nA para.footnote:[lol]</>');
    const [chapter] = divide(html, config);

    expect(chapter.html).toContain('href="notes.xhtml#_footnotedef_1"');
  });

  it('prepends resource file to footnote return links', () => {
    const html = convert('== Ch1\n\nA para.footnote:[lol]</>');
    const [_, notes] = divide(html, config);

    expect(notes.html).toContain('href="sect1.xhtml#_footnoteref_1"');
  });

  it('removes square brackets around footnote ref', () => {
    const html = convert('== Ch1\n\nA para.footnote:[lol]</>');
    const [chapter] = divide(html, config);

    expect(chapter.html).toMatch(/<sup class="footnote"><a[^>]+?>1<\/a><\/sup>/);
  });

  it('removes period after link in footnote', () => {
    const html = convert('== Ch1\n\nA para.footnote:[lol]</>');
    const [_, notes] = divide(html, config);

    expect(notes.html).toContain('<a href="sect1.xhtml#_footnoteref_1">1</a> lol');
  });

  it('separates chapter prefix from body', () => {
    const html = convert('== Chapter 1: Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.chapterNumber).toBe(1);
    expect(section.chapterTitlePrefix).toBe('Chapter 1');
    expect(section.chapterTitleBody).toBe('Foobar');
  });

  it('understands roman numerals', () => {
    const html = convert('== Chapter xl: Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.chapterNumber).toBe(40);
  });

  it('preserves h2', () => {
    const html = convert('== Chapter xl: Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.html).toContain('<h2');
    expect(section.html).toContain('</h2>');
  });

  it('switches dot for colon', () => {
    const html = convert('== Chapter 1. Foobar\n\nPara\n');
    const [section] = divide(html, config);

    expect(section.html).toContain(':');
    expect(section.html).not.toContain('.');
  });

  it('wraps markup around parts', () => {
    const html = convert('== Chapter i: Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    const expected = `
      <header id="_chapter_i_foobar">
        <h2 class="chapter-title__prefix">
          Chapter <span class="chapter-title__number">1</span>
        </h2>
        ${M7BR}
        <div>
          <span class="chapter-title__separator">:</span>
          <span class="chapter-title__body">
            FOOBAR
          </span>
        </div>
        ${M7BR}
      </header>
    `;

    expect(section.html).toContain(stripWhitespace(expected).replace('FOOBAR', ' FOOBAR'));
  });

  it('adds no extra whitespace that causes rendering issues', () => {
    const html = convert('== Chapter i: Foobar\n\nPara.\n');
    const [section] = divide(html, config);
    const match = section.html.match(/(<h2[^>]+?>).+?<\/h2>/i);

    expect(match[0]).not.toMatch(/( {2}|\t|\n)/);
  });

  it('adds space before title body', () => {
    const html = convert('== Chapter i: Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.html).toContain(' FOOBAR');
  });

  it('finds full chapter title bodies', () => {
    const html = convert('== Chapter I. On Conversion and Regeneration.\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.chapterTitleBody).toBe('On Conversion and Regeneration.');
  });

  it('can handle numbered chapters with no title body', () => {
    const html = convert('== Chapter ii.\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.chapterNumber).toBe(2);
    expect(section.chapterTitleBody).toBe('');
    expect(section.html).not.toContain('__separator');
    expect(section.html).not.toContain('__body');
  });

  it('finds short chapter names from raw adoc', () => {
    const adoc = `
[#mychapter, short="Short title"]
== A really, really, long title with a shorter short title

Foobar.
    `;

    const html = convert(adoc);
    const [section] = divide(html, config, adoc);

    expect(section.chapterTitleShort).toBe('Short title');
  });

  it('honors config for chapter number style', () => {
    config = { chapterNumberFormat: 'roman' };
    const html = convert('== Chapter 1.\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.html).toContain('<span class="chapter-title__number">I</span>');
  });

  it('honors config for chapter separator style', () => {
    config = { chapterTitleSeparator: '*' };
    const html = convert('== Chapter 1. Foobar\n\nPara.\n');
    const [section] = divide(html, config);

    expect(section.html).toContain('<span class="chapter-title__separator">*</span>');
  });
});

function stripWhitespace(str) {
  return str.trim().replace(/(\n|\t|  +)/gm, '');
}
