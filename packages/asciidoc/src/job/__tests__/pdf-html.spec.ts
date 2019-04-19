import { pdfHtml, embeddablePdfHtml } from '../pdf-html';
import { jobFromAdoc } from './test-helpers';

describe('pdfHtml()', () => {
  test('html includes combined sections', () => {
    const job = jobFromAdoc('== C1\n\n== C2');
    const html = pdfHtml(job);
    expect(html).toContain('C1');
    expect(html).toContain('C2');
  });

  it('html wrapped in full document', () => {
    const job = jobFromAdoc('== C1\n\n== C2');
    const html = pdfHtml(job);
    expect(html).toContain('<!DOCTYPE html>');
  });

  test('adds first chapter class to first chapter', () => {
    const job = jobFromAdoc('== C1\n\n== C2');
    const html = pdfHtml(job);
    expect(html).toContain('<div class="sect1 first-chapter');
    expect(html).toContain('<div class="sect1 chapter--no-signed-section"');
  });

  it('moves footnotes back inline', () => {
    const job = jobFromAdoc('== C1\n\nA paragraphfootnote:[_So_ cool!] with some text.');
    const html = pdfHtml(job);
    const expected = 'A paragraph<span class="footnote"><em>So</em> cool!</span> with';
    expect(html).toContain(expected);
  });
});

describe('embeddablePdfHtml()', () => {
  test('it should remove closing body and html tags', () => {
    const job = jobFromAdoc('== C1\n\n== C2');
    const html = embeddablePdfHtml(job);
    expect(html).not.toContain('</body>');
    expect(html).not.toContain('</html>');
  });
});
