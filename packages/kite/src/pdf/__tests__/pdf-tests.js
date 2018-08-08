import { getFriend } from '@friends-library/friends';
import { pdf } from '../';
import { convert } from '../../publish/asciidoc';

const rebecca = getFriend('rebecca-jones');

const simpleAdoc = `
== My title

A paragraphfootnote:[_So_ cool!] with a sentence
and a single footnote.
`;

const simpleHtml = convert(simpleAdoc);

describe('pdf()', () => {
  let spec;

  beforeEach(() => {
    spec = {
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0],
      html: simpleHtml,
      config: {},
      sections: [{
        id: 'sect1',
        html: simpleHtml,
        isChapter: true,
        isFootnotes: false,
      }],
    };
  });

  it('adds css file', () => {
    const manifest = pdf(spec);

    expect(manifest['book.css']).toContain('@page');
  });

  test('html has reference to css file', () => {
    const manifest = pdf(spec);

    const expected = '<link href="book.css" rel="stylesheet" type="text/css">';

    expect(manifest['book.html']).toContain(expected);
  });

  it('moves footnotes back inline', () => {
    const manifest = pdf(spec);

    const expected = 'A paragraph<span class="footnote"><em>So</em> cool!</span> with';

    expect(manifest['book.html']).toContain(expected);
  });

  it('splits up chapter titles', () => {
    spec.html = spec.html.replace('My title', 'Chapter 1: Foobar');
    const manifest = pdf(spec);

    const expected = [
      '<span class="chapter-title__prefix">Chapter 1</span>',
      '<span class="chapter-title__body">Foobar</span>'
    ].join('');

    expect(manifest['book.html']).toContain(expected);
  });

  it('adds first-chapter classes to only first chapter', () => {
    spec.html = convert('== One\n\nPara.\n\n== Two\n\nPara.\n');

    const manifest = pdf(spec);

    expect(manifest['book.html']).toContain('<div class="sect1 first-chapter">');
    expect(manifest['book.html']).toContain('<div class="sect1">');
  });
});
