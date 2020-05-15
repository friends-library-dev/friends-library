import { syntax as css } from '@friends-library/types';
import { CoverCssModule } from './types';
import { dynamifyCss } from './helpers';

const spine: CoverCssModule = (scaler, scope) => {
  const staticCss = css`
    .Cover .spine {
      position: relative;
    }

    .pdf .binding--saddle-stitch .Cover .spine,
    .web .cover--2d .binding--saddle-stitch .Cover .spine {
      width: 0;
      display: none;
    }

    .spine--pgs-lt-140 > * {
      display: none !important;
    }

    .Cover .spine .logo-icon {
      height: 4%;
      position: absolute;
      top: 7%;
      left: 50%;
      transform: translateX(-44%);
      z-index: 1;
    }

    .Cover .spine .diamond {
      position: absolute;
      top: auto;
      bottom: 3.5% !important;
      left: 50%;
      transform: translateX(-50%);
    }

    .spine__title,
    .spine__author {
      font-size: 4.7%;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      position: absolute;
      writing-mode: vertical-rl;
      top: 20%;
    }

    .trim--s .spine__title {
      top: 15%;
    }

    .Cover.trim--s .spine .logo-icon {
      top: 5.3%;
    }

    .Cover.trim--xl .spine .logo-icon {
      top: 7.6%;
    }

    .trim--xl .spine__title {
      top: 21.5%;
    }

    .spine__author {
      top: auto;
      bottom: 11.5%;
      font-size: 3.95%;
    }

    .trim--s .spine__author {
      font-size: 4.2%;
    }

    .trim--m .spine__author {
      font-size: 3.65%;
      bottom: 10.5%;
    }

    .trim--xl .spine__author {
      font-size: 3.34%;
      bottom: 11.2%;
    }

    .trim--xl .spine__title {
      font-size: 4.33%;
    }

    .spine--pgs-lt-160 .logo-icon {
      height: 3.23%;
    }

    .spine--pgs-lt-180 .logo-icon {
      height: 3.4%;
    }
  `;

  const dynamicCss = css`
    .Cover .spine__title,
    .Cover .spine__author {
      word-spacing: 0.03in;
    }

    .Cover .spine .diamond {
      width: 0.365in;
    }

    .Cover .spine--pgs-lt-180 .spine__title {
      font-size: 0.23in;
    }

    .Cover .spine--pgs-lt-180 .diamond {
      width: 0.3in;
    }

    .Cover .spine--pgs-lt-160 .diamond {
      width: 0.25in;
    }

    .Cover .spine--pgs-lt-180 .spine__title {
      font-size: 0.23in;
    }

    .Cover .spine--pgs-lt-180 .diamond {
      width: 0.3in;
    }

    .Cover .spine--pgs-lt-160 .diamond {
      width: 0.25in;
    }
  `;
  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default spine;
