import { nav, tocItems, landmarks } from '../nav';
import { testJob } from '../../test-helpers';

describe('nav()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  it('contains epub:type toc which is required', () => {
    const markup = nav(job);

    expect(markup).toContain('epub:type="toc" id="toc"');
    expect(markup).toContain('href="half-title.xhtml">Title page<');
  });

  it('contains landmarks section', () => {
    const markup = nav(job);

    expect(markup).toContain('epub:type="landmarks" hidden=""');
    expect(markup).toContain('epub:type="titlepage">Title page<');
  });
});

describe('tocItems()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  test('first item is hidden half-title', () => {
    const [first] = tocItems(job);

    expect(first).toMatchObject({
      hidden: true,
      href: 'half-title.xhtml',
      text: 'Title page',
    });
  });

  test('includes generated sections after title', () => {
    const [_, sect1, sect2] = tocItems(testJob('== One\n\n== Two'));

    expect(sect1).toMatchObject({
      href: 'section1.xhtml',
      text: 'One',
    });

    expect(sect2).toMatchObject({
      href: 'section2.xhtml',
      text: 'Two',
    });
  });

  test('notes section not included in toc items', () => {
    const items = tocItems(testJob('== C1\n\nPara.footnote:[Foo.]'));

    expect(items.find(i => i.href === 'notes.xhtml')).toBeUndefined();
  });
});


describe('landmarks()', () => {
  let job;

  beforeEach(() => {
    job = testJob();
  });

  test('epub contains only title and beginning', () => {
    job.target = 'epub';

    const lm = landmarks(job);

    expect(lm).toHaveLength(2);

    expect(lm[0]).toEqual({
      type: 'titlepage',
      href: 'half-title.xhtml',
      text: 'Title page',
    });

    expect(lm[1]).toEqual({
      type: 'bodymatter',
      href: 'half-title.xhtml',
      text: 'Beginning',
    });
  });

  test('mobi also has content toc', () => {
    job.target = 'mobi';

    const lm = landmarks(job);

    expect(lm).toHaveLength(3);

    expect(lm[1]).toEqual({
      type: 'toc',
      href: 'nav.xhtml',
      text: 'Table of Contents',
    });
  });
});
