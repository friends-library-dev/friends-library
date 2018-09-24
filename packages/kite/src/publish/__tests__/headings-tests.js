import { replaceHeadings, navText } from '../headings';
import { testJob } from '../test-helpers';

describe('replaceHeadings()', () => {
  let html;
  let heading;
  let job;

  beforeEach(() => {
    html = '{% chapter-heading %}';
    heading = { id: '_', text: 'Foobar' };
    job = testJob();
  });

  it('replaces simple heading with wrapped h2', () => {
    const replaced = replaceHeadings(html, heading, job);

    const expected = '<h2>Foobar</h2>';

    expect(replaced).toContain(expected);
  });

  it('replaces sequence-headers with more complex markup', () => {
    heading.sequence = { type: 'Chapter', number: 3 };

    const replaced = replaceHeadings(html, heading, job);

    expect(replaced).toContain('Chapter&#160;');
    expect(replaced).toMatch(/\s+III\s+<\/span>/);
    expect(replaced).toContain('chapter-heading__sequence__number');
    expect(replaced).toContain('<div class="chapter-heading__title"');
    expect(replaced).toMatch(/Foobar\s+<\/div>/);
  });

  it('marks up multi-line simple h2s', () => {
    heading.text = 'Foobar / Baz'; // line breaks indicated by " / "

    const replaced = replaceHeadings(html, heading, job);

    const expected = `
      <h2>
        <span class="line line-1">Foobar <br class="m7"/></span>
        <span class="line line-2">Baz</span>
      </h2>
    `.replace(/\s\s+/gm, '');

    expect(replaced).toContain(expected);
  });

  it('replaces sequence-only header with simple markup', () => {
    heading.text = '';
    heading.sequence = { type: 'Chapter', number: 3 };

    const replaced = replaceHeadings(html, heading, job);

    expect(replaced).toContain('<h2>Chapter III</h2>');
  });

  it('passes heading style through to markup', () => {
    html = '{% chapter-heading, foo %}';
    const replaced = replaceHeadings(html, heading, job);

    expect(replaced).toContain('chapter-heading--foo');
  });

  it('sets heading style to normal if no inline designation nor doc config', () => {
    const replaced = replaceHeadings(html, heading, job);

    expect(replaced).toContain('chapter-heading--normal');
  });

  it('uses doc config for document-wide heading style override', () => {
    job.spec.config.chapterHeadingStyle = 'blurb';
    const replaced = replaceHeadings(html, heading, job);

    expect(replaced).toContain('chapter-heading--blurb');
  });
});

describe('navText()', () => {
  it('trims trailing period', () => {
    const heading = { text: 'Foobar.' };

    const replaced = navText(heading);

    expect(replaced).not.toContain('Foobar.');
  });

  it('does not trim period after etc.', () => {
    const heading = { text: 'Foobar, etc.' };

    const replaced = navText(heading);

    expect(replaced).toContain('Foobar, etc.');
  });

  it('trims trailing comma', () => {
    const heading = { text: 'Foobar,' };

    const replaced = navText(heading);

    expect(replaced).not.toContain('Foobar,');
  });

  it('returns heading.text if no short text and not sequence', () => {
    const heading = { text: 'Foobar' };
    const text = navText(heading);

    expect(text).toBe('Foobar');
  });

  it('returns heading.shortText if set and not sequence', () => {
    const heading = { text: 'Foobar', shortText: 'Foo' };
    const text = navText(heading);

    expect(text).toBe('Foo');
  });

  it('returns chapter and short text when available for sequence', () => {
    const heading = {
      text: 'Foobar',
      shortText: 'Foo',
      sequence: {
        type: 'Chapter',
        number: 5,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter V &#8212; Foo');
  });

  it('returns chapter and text (when no short text) for sequence', () => {
    const heading = {
      text: 'Foobar',
      sequence: {
        type: 'Chapter',
        number: 5,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter V &#8212; Foobar');
  });

  it('does not include trailing emdash if sequence and no text', () => {
    const heading = {
      text: '',
      sequence: {
        type: 'Chapter',
        number: 4,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter IV');
  });

  it('does not include trailing lines if multi-line text', () => {
    const heading = {
      text: 'Foobar / Hashbaz',
      sequence: {
        type: 'Chapter',
        number: 4,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter IV &#8212; Foobar');
  });
});
