import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const pdf: CoverCssModule = ({ size, pages }, scaler, scope) => {
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

  const dims = docDims(size, pages, scaler);
  const width = dims.width * 2 + dims.pdfSpineWidth + 2 * dims.printBleed;
  const height = dims.height + 2 * dims.printBleed;

  const sizeCss = css`
    .Cover.browser {
      width: ${width}in;
      height: ${height}in;
    }

    .Cover .print-pdf {
      margin: 0.125in;
    }

    /* change percentage height of white block because now padded by bleed area */
    .Cover.trim--s::after {
      height: 14.376%;
    }
    .Cover.trim--m::after {
      height: 17.817%;
    }
    .Cover.trim--xl::after {
      height: 19.707%;
    }
    /* end change percentage height */

    @page {
      size: ${width}in ${height}in landscape;
    }
  `;
  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default pdf;
