import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const spine: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    .Cover .spine {
      /* width: var(--spineWidth); */
      /* height: var(--bookHeight); */
      position: relative;
      /* top: var(--trimBleed); */
      /* left: var(--edgeToSpine); */
    }

    .pdf .binding--saddle-stitch .Cover .spine,
    .pdf .binding--saddle-stitch .guide--spine,
    .web .cover--2d .binding--saddle-stitch .Cover .spine,
    .web .cover--2d .binding--saddle-stitch .guide--spine {
      width: 0;
      display: none;
    }

    .spine--pgs-lt-140 > * {
      display: none !important;
    }

    .Cover .spine .logo-icon {
      height: 4%;
      /* fill: var(--bgColor); */
      position: absolute;
      /* top: var(--edgeToSafe); */
      top: 7%;
      left: 50%;
      transform: translateX(-44%);
    }

    .Cover .spine .diamond {
      /* fill: var(--bgColor); */
      width: 0.365in;
      top: auto;
      bottom: 3.5% !important;
      fill: white;
    }

    .spine__title,
    .spine__author {
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      position: absolute;
      writing-mode: vertical-rl;
      /* line-height: var(--spineWidth); */
      /* font-size: 0.26in; */
      /* word-spacing: 0.035in; */
      top: 20%;
    }

    .trim--s .spine__title {
      top: 15%;
    }

    .trim--s .Cover .spine .logo-icon {
      top: 5.6%;
    }

    .trim--xl .spine__title {
      top: 21.5%;
    }

    .spine__author {
      /* display: var(--spineAuthorDisplay); */
      top: auto;
      bottom: 11%;
      /* font-size: 0.2in; */
    }

    .spine--pgs-lt-180 .spine__title {
      /* font-size: 0.23in; */
    }

    .spine--pgs-lt-180 .diamond {
      /* width: 0.3in; */
    }

    .spine--pgs-lt-180 .logo-icon {
      height: 3.4%;
    }

    .spine--pgs-lt-160 .diamond {
      /* width: 0.25in; */
    }

    .spine--pgs-lt-160 .logo-icon {
      height: 3.23%;
    }
  `;

  return [staticCss, dynamifyCss('', scope, scaler)];
};

export default spine;
