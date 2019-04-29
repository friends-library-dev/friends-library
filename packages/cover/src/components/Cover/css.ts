import { Css } from '@friends-library/types';
import { getBookSize } from '@friends-library/asciidoc';
import { mapValues } from 'lodash';
import cssString from './Cover.css';
import { CoverProps } from './types';

export function cssVars(props: CoverProps): Record<string, string> {
  const { dims: trim } = getBookSize(props.printSize);
  const coverPad = 0.25;
  const spinePad = 0.06;
  const pagesPerInch = 444;
  const spineWidth = spinePad + props.pages / pagesPerInch;
  return mapValues(
    {
      trim: 0.125,
      safety: 0.25,
      pageWidth: trim.width,
      pageHeight: trim.height,
      spineWidth: spineWidth,
      coverHeight: trim.height + coverPad,
      coverWidth: trim.width * 2 + spineWidth + coverPad,
    },
    v => `${v}in`,
  );
}

export function coverCss(props: CoverProps, context: 'pdf' | 'web'): Css {
  let css = cssString;
  const vars = cssVars(props);
  Object.entries(vars).forEach(([key, val]) => {
    const regx = new RegExp(`var\\(--${key}\\)`, 'g');
    css = css.replace(regx, val);
  });

  const PDF_TO_WEB_MULTIPLIER = 1.1358;

  if (context === 'web') {
    css = css.replace(/(?<inches>\d*(?:\.\d+)?)in(?<after>;| )/g, (...args) => {
      const { inches, after } = args[args.length - 1];
      return `${Number(inches) * PDF_TO_WEB_MULTIPLIER}in${after}`;
    });
  }

  return css;
}
