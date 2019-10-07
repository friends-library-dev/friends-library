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

    .prince .Cover .spine > * {
      z-index: 1;
    }

    .prince .Cover .front__safe > * {
      z-index: 1;
    }

    .prince .Cover .front .author {
      z-index: 19999;
    }
  `;

  const dims = docDims(size, pages, scaler);
  const width = dims.width * 2 + dims.pdfSpineWidth;
  const sizeCss = css`
    .Cover.browser {
      width: ${width}in;
      height: ${dims.height}in;
    }

    @page {
      size: ${width}in ${dims.height}in landscape;
    }
  `;
  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default pdf;
