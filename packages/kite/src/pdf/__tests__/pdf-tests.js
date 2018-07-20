import Asciidoctor from 'asciidoctor.js';
import { getFriend } from '@friends-library/friends';
import { printPdf } from '../';

const asciidoctor = new Asciidoctor();
const rebecca = getFriend('rebecca-jones');

const simpleAdoc = `
== My title

A paragraphfootnote:[_So_ cool!] with a sentence
and a single footnote.
`;

const simpleHtml = asciidoctor.convert(simpleAdoc);

describe('printPdf()', () => {
  let spec;

  beforeEach(() => {
    spec = {
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0],
      html: simpleHtml,
    };
  });

  it('adds css file', () => {
    const manifest = printPdf(spec);

    expect(manifest['book.css']).toContain('@page');
  });

  test('html has reference to css file', () => {
    const manifest = printPdf(spec);

    const expected = '<link href="book.css" rel="stylesheet" type="text/css">';

    expect(manifest['book.html']).toContain(expected);
  });

  it('moves footnotes back inline', () => {
    const manifest = printPdf(spec);

    const expected = 'A paragraph<span class="footnote"><em>So</em> cool!</span> with';

    expect(manifest['book.html']).toContain(expected);
  });

  it('splits up chapter titles', () => {
    spec.html = spec.html.replace('My title', 'Chapter 1: Foobar');
    const manifest = printPdf(spec);

    const expected = [
      '<span class="chapter-title__prefix">Chapter 1</span>',
      '<span class="chapter-title__body">Foobar</span>'
    ].join('');

    expect(manifest['book.html']).toContain(expected);
  });
});
