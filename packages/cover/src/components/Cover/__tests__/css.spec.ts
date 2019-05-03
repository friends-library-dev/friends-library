import { CoverProps } from '@friends-library/types';
import { getBookSize } from '@friends-library/asciidoc';
import { cssVars } from '../css';

describe('cssVars()', () => {
  let props: CoverProps;
  let trim: any;

  beforeEach(() => {
    props = {
      title: 'Journal of George Fox',
      author: 'George Fox',
      pages: 555,
      printSize: 'm',
      edition: 'original',
      blurb: 'TODO',
      showGuides: false,
    };
    ({ dims: trim } = getBookSize(props.printSize));
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
});
