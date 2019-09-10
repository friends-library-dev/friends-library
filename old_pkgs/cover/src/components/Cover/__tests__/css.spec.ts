import { CoverProps, PrintSize } from '@friends-library/types';
import { getPrintSizeDetails } from '@friends-library/asciidoc';
import { cssVars } from '../css';

describe('cssVars()', () => {
  let props: CoverProps;
  let trim: any;

  beforeEach(() => {
    props = {
      title: 'Journal of George Fox',
      author: 'George Fox',
      pages: 555,
      size: 'm',
      edition: 'original',
      blurb: 'TODO',
      showGuides: false,
      customCss: '',
      customHtml: '',
    };
    ({ dims: trim } = getPrintSizeDetails(props.size));
  });

  test('cover height is book size height plus 0.25in fudge', () => {
    const { coverHeight } = cssVars(props);
    expect(coverHeight).toBe(`${trim.height + 0.25}in`);
  });

  test('cover width is correct', () => {
    props.pages = 444; // 1 in
    const { coverWidth } = cssVars(props);
    expect(coverWidth).toBe(`${trim.width * 2 + 1 + 0.06 + 0.25}in`);
  });

  test('book with less than 32 pages has no width added for spine', () => {
    props.pages = 31;
    const { coverWidth } = cssVars(props);
    expect(coverWidth).toBe(`${trim.width * 2 + 0.25}in`);
  });

  const spineAuthorDisplayCases: [string, string, PrintSize, boolean][] = [
    ['The Life and Letters of John&nbsp;Fothergill', 'John Fothergill', 'm', true],
    ['The Life and Letters of Catherine&nbsp;Payton', 'Catherine Payton', 'm', true],
    ['The Christian Progress of George&nbsp;Whitehead', 'George Whitehead', 'm', false],
    // all of the `W`s should be factored as making it longer
    ['The Journal and Writings of John&nbsp;Woolman', 'John Woolman', 'm', false],
  ];

  test.each(spineAuthorDisplayCases)(
    'spine author display for "%s"',
    (title, author, size, display) => {
      props.title = title;
      props.author = author;
      props.size = size;
      const { spineAuthorDisplay } = cssVars(props);
      expect(spineAuthorDisplay).toBe(display ? 'block' : 'none');
    },
  );
});
