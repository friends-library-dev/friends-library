import { CoverCssModule } from './types';
import { css, scopeCss, docDims } from './helpers';

const common: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    .Cover {
      font-family: 'Baskerville', Georgia, serif;
      background: white;
      color: white;
    }

    .Cover .has-bg::before {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      height: 85%;
      width: 100%;
    }

    .Edition--original .logo-icon {
      fill: #9d9d80;
    }

    .Edition--modernized .logo-icon {
      fill: #628c9d;
    }

    .Edition--updated .logo-icon {
      fill: #6c3142;
    }

    .Cover.Edition--original .has-bg::before {
      background-color: #9d9d80;
    }

    .Cover.Edition--modernized .has-bg::before {
      background-color: #628c9d;
    }

    .Cover.Edition--updated .has-bg::before {
      background-color: #6c3142;
    }
  `;

  const dims = docDims(size, pages, scaler);
  const sizeCss = css`
    .Cover .back,
    .Cover .front,
    .Cover .spine {
      height: ${dims.height}in;
    }

    .Cover .back,
    .Cover .front {
      width: ${dims.width}in;
    }

    .Cover .spine {
      width: ${dims.pdfSpineWidth}in;
    }
  `;

  return [staticCss, scopeCss(sizeCss, scope)];
};

export default common;
