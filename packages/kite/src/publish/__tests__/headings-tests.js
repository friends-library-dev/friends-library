import { replaceHeadings, navText } from '../headings';

describe('replaceHeadings()', () => {
  let html;
  let heading;

  beforeEach(() => {
    html = '{% chapter-heading %}';
    heading = { id: '_', text: 'Foobar' };
  });

  it('replaces simple heading with wrapped h2', () => {
    const replaced = replaceHeadings(html, heading);

    const expected = '<h2>Foobar</h2>';
    expect(replaced).toContain(expected);
  });

  it('replaces sequence-headers with more complex markup', () => {
    heading.sequence = { type: 'chapter', number: 3 };

    const replaced = replaceHeadings(html, heading);

    expect(replaced).toContain('Chapter ');
    expect(replaced).toMatch(/3\s+<\/span>/);
    expect(replaced).toContain('chapter__sequence__number');
    expect(replaced).toContain('<div class="chapter__title"');
    expect(replaced).toMatch(/Foobar\s+<\/div>/);
  });
});

describe('navText()', () => {
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
        type: 'chapter',
        number: 5,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter 5 &#8212; Foo');
  });

  it('returns chapter and text (when no short text) for sequence', () => {
    const heading = {
      text: 'Foobar',
      sequence: {
        type: 'chapter',
        number: 5,
      },
    };

    const text = navText(heading);

    expect(text).toBe('Chapter 5 &#8212; Foobar');
  });
});
