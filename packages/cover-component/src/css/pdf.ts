import { css, dynamifyCss, docDims, PRINT_BLEED, pdfSpineWidth } from './helpers';
import { CoverProps } from '@friends-library/types';

export default function pdf(
  { size, pages }: Pick<CoverProps, 'size' | 'pages'>,
  scaler?: number,
  scope?: string,
) {
  const staticCss = css`
    html.prince,
    html.prince body {
      margin: 0;
      padding: 0;
    }

    .Cover .print-pdf {
      display: flex;
    }

    @page {
      margin: 0;
    }
  `;

  const dims = docDims(size);
  const widthNoBleed = dims.width * 2 + pdfSpineWidth(pages);
  const heightNoBleed = dims.height;
  const width = widthNoBleed + 2 * PRINT_BLEED;
  const height = heightNoBleed + 2 * PRINT_BLEED;

  const sizeCss = css`
    .Cover.browser {
      width: ${widthNoBleed}in;
      height: ${heightNoBleed}in;
    }

    .Cover--pdf--bleed.browser {
      width: ${width}in;
      height: ${height}in;
    }

    .Cover.Cover--pdf--bleed .print-pdf {
      margin: 0.125in;
    }

    /* change percentage height of white block because now padded by bleed area */
    .Cover--pdf--bleed.trim--s::after {
      height: 14.19%;
    }
    .Cover--pdf--bleed.trim--m::after {
      height: 17.817%;
    }
    .Cover--pdf--bleed.trim--xl::after {
      height: 19.707%;
    }
    /* end change percentage height */

    @page {
      size: ${width}in ${height}in landscape;
    }
  `;
  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
}
