import { testJob } from '../../test-helpers';
import { packageDocument, manifestItems, spineItems } from '../package-document';

describe('packageDocument()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('correctly sets language', () => {
    job.spec.lang = 'es';
    const xml = packageDocument(job);
    expect(xml).toContain('<dc:language id="pub-language">es</dc:language>');
  });

  it('contains the document title', () => {
    job.spec.meta.title = 'Foobar baz';
    const xml = packageDocument(job);
    expect(xml).toContain('<dc:title id="pub-title">Foobar baz</dc:title>');
  });

  it('contains the friend author', () => {
    const xml = packageDocument(job);
    expect(xml).toContain('<dc:creator id="author">George Fox</dc:creator>');
  });

  it('contains the file-as meta tag', () => {
    const xml = packageDocument(job);
    expect(xml).toContain('<meta property="file-as" refines="#author">Fox, George</meta>');
  });

  it('must contain dc:terms modified', () => {
    job.spec.revision.timestamp = 1532465023;
    const xml = packageDocument(job);
    expect(xml).toContain('<meta property="dcterms:modified">2018-07-24T08:43:43Z</meta>');
  });

  test('uuid should be constructed to uniquely refer to ebook doc', () => {
    const xml = packageDocument(job);
    expect(xml).toContain(`<dc:identifier id="pub-id">friends-library/${job.id}</dc:identifier>`);
  });

  it('adds manifest items to manifest', () => {
    const xml = packageDocument(job);

    const item = '<item id="section1" href="section1.xhtml" media-type="application/xhtml+xml"/>';
    expect(xml).toContain(item);
  });

  it('adds spine items to spine', () => {
    const xml = packageDocument(job);

    expect(xml).toContain('<itemref idref="section1"/>');
    expect(xml).toContain('<itemref idref="notes"/>');
  });
});

describe('manifestItems()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('always includes css item', () => {
    const items = manifestItems(job);

    expect(items.get('css')).toMatchObject({ href: 'style.css', 'media-type': 'text/css' });
  });

  it('always includes nav item', () => {
    const items = manifestItems(job);

    expect(items.get('nav')).toMatchObject({
      href: 'nav.xhtml',
      'media-type': 'application/xhtml+xml',
      properties: 'nav',
    });
  });

  it('includes sections', () => {
    const items = manifestItems(testJob('== C1\n\n== C2'));

    expect(items.get('section1')).toMatchObject({
      href: 'section1.xhtml',
      'media-type': 'application/xhtml+xml',
    });

    expect(items.get('section2')).toMatchObject({
      href: 'section2.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  });

  test('special notes section gets added to manifest', () => {
    const items = manifestItems(testJob('== C1\n\nPara.footnote:[Foo.]'));

    expect(items.get('notes')).toMatchObject({
      href: 'notes.xhtml',
      'media-type': 'application/xhtml+xml',
    });
  });

  test('frontmatter added to manifest', () => {
    const items = manifestItems(testJob('== C1\n\nPara.footnote:[Foo.]'));

    expect(items.has('half-title')).toBe(true);
    expect(items.has('copyright')).toBe(true);
    expect(items.has('footnote-helper')).toBe(true);
  });
});

describe('spineItems()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('includes section and notes', () => {
    const items = spineItems(job);

    expect(items).toContain('section1');
    expect(items).toContain('notes');
  });

  it('contains frontmatter items', () => {
    job = testJob('== C1\n\nPara.footnote:[Foo.]');
    const items = spineItems(job);

    expect(items[0]).toBe('half-title');
    expect(items[1]).toBe('copyright');
    expect(items[2]).toBe('footnote-helper');
  });

  it('does not include nav item', () => {
    const items = spineItems(job);

    expect(items).not.toContain('nav');
  });
});
