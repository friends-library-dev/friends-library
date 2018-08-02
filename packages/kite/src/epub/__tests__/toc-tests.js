import { toc } from '../toc';
import { convert } from '../../publish/asciidoc';
import { divide } from '../../publish/divide';

describe('toc()', () => {

  let spec;

  beforeEach(() => {
    spec = {
      config: {},
      document: {
        title: 'Document Title',
      }
    };
  });

  it('formats numbered chapters', () => {
    const html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    const sections = divide(html);

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Introduction</a>');
    expect(tocHtml).toContain('<a href="sect2.xhtml">Chapter 1 — Foo</a>');
  });

  it('prefers using short title', () => {
    const html = convert('[#intro]\n== Introduction\n\nPara.\n\n');
    const sections = divide(html, { shortTitles: { intro: 'Intro' } });

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Intro</a>');
  });

  it('prefers short title with numbered chapter', () => {
    const html = convert('[#intro]\n== Chapter i. Introduction\n\nPara.\n\n');
    const sections = divide(html, { shortTitles: { intro: 'Intro' } });

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Chapter 1 — Intro</a>');
  });

  it('honors config chapter number style', () => {
    spec.config = { chapterNumberFormat: "roman" };
    const html = convert('== Chapter 1: Foobar\n\nPara.\n');
    const sections = divide(html, spec.config);

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Chapter I — Foobar</a>');
  });

  it('includes landmarks with title page', () => {
    const html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    const sections = divide(html);

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('epub:type="landmarks"');
    expect(tocHtml).toContain('<a href="half-title.xhtml" epub:type="titlepage">Title page</a>');
  });

  test('epubs do not contain toc landmark', () => {
    spec.target = 'epub';
    const html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    const sections = divide(html);

    const tocHtml = toc(spec, sections);

    expect(tocHtml).not.toContain('<a href="nav.xhtml" epub:type="toc">Table of Contents</a>');
  });

  test('mobis do contain toc landmark', () => {
    spec.target = 'mobi';
    const html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    const sections = divide(html);

    const tocHtml = toc(spec, sections);

    expect(tocHtml).toContain('<a href="nav.xhtml" epub:type="toc">Table of Contents</a>');
  });
});
