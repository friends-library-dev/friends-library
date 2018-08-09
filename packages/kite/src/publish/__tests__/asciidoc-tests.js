import { prepareAsciidoc, convert } from '../asciidoc';


describe('prepareAsciidoc()', () => {
  it('converts funky footnote newline carets', () => {
    const result = prepareAsciidoc('Afootnote:[a] caret^\nfootnote:[lol].');

    expect(result).toContain('caretfootnote:[lol].');
  });

  it('converts to curly quotes', () => {
    const result = prepareAsciidoc('Hello "`good`" sir.');

    expect(result).toBe('Hello “good” sir.');
  });

  it('converts curly apostrophes', () => {
    const result = prepareAsciidoc("Hello '`good`' sir.");

    expect(result).toBe('Hello ‘good’ sir.');
  });

  it('does not add extra extra footnote when no footnotes', () => {
    const result = prepareAsciidoc('== Chapter title\n\nPara.\n');

    expect(result).not.toContain('footnote:');
  });

  it('adds extra explanation footnote if footnote found', () => {
    const result = prepareAsciidoc('== Chapter title\n\nPara.footnote:[lol]\n');

    expect(result.match(/footnote:/g).length).toBe(2);
  });

  it('converts hr.asterism to pass-thru html', () => {
    const result = prepareAsciidoc("[.asterism]\n'''\n\nPara.");

    expect(result).not.toContain("[.asterism]\n'''");
    expect(result).toContain('++++\n<div class="asterism">');
  });
});

describe('convert()', () => {
  it('removes explanatory footnote call', () => {
    const adoc = prepareAsciidoc('== Title\n\nPara.footnote:[lol]');
    const html = convert(adoc);

    expect(html).not.toContain('id="_footnoteref_1');
    expect(html).not.toContain('>1</a>]</sup>');
    expect(html.match(/<\/sup>/gim).length).toBe(1);
  });

  // #footnotes hr { display: none; } breaks mobi7 ¯\_(ツ)_/¯
  it('removes the <hr> element from the #footnotes div', () => {
    const html = convert('== Title\n\nPara.footnote:[lol]');

    expect(html).not.toContain('<hr>');
  });
});
