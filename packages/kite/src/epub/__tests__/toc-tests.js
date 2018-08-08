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
    spec.html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    spec.sections = divide(spec.html);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Introduction</a>');
    expect(tocHtml).toContain('<a href="sect2.xhtml">Chapter 1 — Foo</a>');
  });

  it('prefers using short title', () => {
    spec.html = convert('[#intro]\n== Introduction\n\nPara.\n\n');
    spec.config = { shortTitles: { intro: 'Intro' } };
    spec.sections = divide(spec.html, spec.config);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Intro</a>');
  });

  it('prefers short title with numbered chapter', () => {
    spec.html = convert('[#intro]\n== Chapter i. Introduction\n\nPara.\n\n');
    spec.config = { shortTitles: { intro: 'Intro' } };
    spec.sections = divide(spec.html, spec.config);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Chapter 1 — Intro</a>');
  });

  it('honors config chapter number style', () => {
    spec.config = { chapterNumberFormat: "roman" };
    spec.html = convert('== Chapter 1: Foobar\n\nPara.\n');
    spec.sections = divide(spec.html);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('<a href="sect1.xhtml">Chapter I — Foobar</a>');
  });

  it('includes landmarks with title page', () => {
    spec.html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    spec.sections = divide(spec.html);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('epub:type="landmarks"');
    expect(tocHtml).toContain('<a href="half-title.xhtml" epub:type="titlepage">Title page</a>');
  });

  test('epubs do not contain toc landmark', () => {
    spec.target = 'epub';
    spec.html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    spec.sections = divide(spec.html);

    const tocHtml = toc(spec);

    expect(tocHtml).not.toContain('<a href="nav.xhtml" epub:type="toc">Table of Contents</a>');
  });

  test('mobis do contain toc landmark', () => {
    spec.target = 'mobi';
    spec.html = convert('== Introduction\n\nPara.\n\n== Chapter i. Foo\n\nPara.\n');
    spec.sections = divide(spec.html);

    const tocHtml = toc(spec);

    expect(tocHtml).toContain('<a href="nav.xhtml" epub:type="toc">Table of Contents</a>');
  });
});
