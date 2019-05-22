import { Css, CoverProps } from '@friends-library/types';
import { getBookSize } from '@friends-library/asciidoc';
import { mapValues } from 'lodash';
import cssString from './css/cover.css';

export function cssVars(props: CoverProps): Record<string, string> {
  const { dims: book } = getBookSize(props.printSize);
  const safety = 0.25;
  const trimBleed = 0.125;
  const spinePad = 0.06;
  const pagesPerInch = 444;
  const threeDSpineWidth = spinePad + props.pages / pagesPerInch;
  const spineWidth = props.pages < 32 ? 0 : threeDSpineWidth;
  const bgHeightSizeS = 6.005;
  const bgHeightSizeM = 7.08;
  const bgHeightSizeXl = 7.305;
  return mapValues(
    {
      trimBleed,
      safety,
      pageWidth: book.width,
      pageHeight: book.height,
      spineWidth: spineWidth,
      halfSpineWidth: spineWidth / 2,
      halfThreeDSpineWidth: threeDSpineWidth / 2,
      threeDSpineWidth,
      spineAuthorDisplay: spineAuthorDisplay(props),
      edgeToSafe: trimBleed + safety,
      safeAreaWidth: book.width - safety * 2,
      safeAreaHeight: book.height - safety * 2,
      edgeToSpine: book.width + trimBleed,
      edgeToSpineCenter: book.width + trimBleed + spineWidth / 2,
      bookWidth: book.width,
      bookHeight: book.height,
      halfBookWidth: book.width / 2,
      halfBookHeight: book.height / 2,
      coverHeight: book.height + trimBleed * 2,
      coverWidth: book.width * 2 + spineWidth + trimBleed * 2,
      guideSafetyWidth: book.width * 2 + spineWidth,
      guidesDisplay: props.showGuides ? 'block' : 'none',
      threeDLeftOffset: (book.width - threeDSpineWidth) / 2,
      threeDTopOffset: (book.height - threeDSpineWidth) / 2,
      bgHeightSizeS,
      bgHeightSizeM,
      bgHeightSizeXl,
      bgHeightPlusTrimBleedSizeS: bgHeightSizeS + trimBleed,
      bgHeightPlusTrimBleedSizeM: bgHeightSizeM + trimBleed,
      bgHeightPlusTrimBleedSizeXl: bgHeightSizeXl + trimBleed,
      bgColor: {
        updated: '#6C3142',
        modernized: '#628C9D',
        original: '#9D9D80',
        spanish: '#C18C59',
      }[props.edition],
    },
    v => (typeof v === 'number' ? `${v}in` : v),
  );
}

export function coverCss(props: CoverProps, scaler?: number): Css {
  let css = `${cssString}${props.customCss}`;
  const vars = cssVars(props);
  Object.entries(vars).forEach(([key, val]) => {
    const regx = new RegExp(`var\\(--${key}\\)`, 'g');
    css = css.replace(regx, val);
  });

  if (scaler) {
    css = css.replace(/(?<inches>\d*(?:\.\d+)?)in(?! +{)(?<after>;| |\))/g, (...args) => {
      const { inches, after } = args[args.length - 1];
      return `${Number(inches) * scaler}in${after}`;
    });
  }

  return css;
}

function spineAuthorDisplay({ title, author, printSize }: CoverProps): 'block' | 'none' {
  const lastName = String(author.split(' ').pop());
  let totalChars = title.replace(/&nbsp;/g, ' ').length + lastName.length;
  const numWideLetters = (`${title}${lastName}`.match(/(W|D)/g) || []).length;
  totalChars += numWideLetters;

  if (printSize === 'm' && totalChars >= 50) {
    return 'none';
  }

  return 'block';
}
