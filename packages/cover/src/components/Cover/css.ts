import { Css } from '@friends-library/types';
import { getBookSize } from '@friends-library/asciidoc';
import cssString from './Cover.css';
import { CoverProps } from './types';

export function cssVars(props: CoverProps): Record<string, string> {
  const { dims: trim } = getBookSize(props.printSize);
  const coverPad = 0.25;
  const spinePad = 0.06;
  const pagesPerInch = 444;
  const spineWidth = spinePad + props.pages / pagesPerInch;
  return {
    coverHeight: `${trim.height + coverPad}in`,
    coverWidth: `${trim.width * 2 + spineWidth + coverPad}in`,
  };
}

export function coverCss(props: CoverProps): Css {
  let css = cssString;
  const vars = cssVars(props);
  Object.entries(vars).forEach(([key, val]) => {
    const regx = new RegExp(`var\\(--${key}\\)`, 'g');
    css = css.replace(regx, val);
  });

  return css;
}
