import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const pdf: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    html,
    body {
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
  const sizeCss = css`
    @page {
      size: 13in 9in landscape;
    }
  `;
  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default pdf;
