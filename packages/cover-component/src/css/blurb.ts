import { syntax as css } from '@friends-library/types';
import { CoverCssModule } from './types';
import { dynamifyCss } from './helpers';
import sizingCss from './blurb-sizing';

const blurb: CoverCssModule = (scaler, scope) => {
  const staticCss: string = css`
    .Cover .brackets {
      fill: white;
      position: absolute;
      opacity: 0.32;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      height: 100%;
      width: 100%;
    }

    .Cover .blurb {
      padding: 1.65em 3.65em 1.35em 3.65em;
      cursor: text;
      margin: 0 8%;
      position: relative;
      top: 23%;
      font-size: 2.9%;
      line-height: 160%;
      text-align: center;
      z-index: 100000;
      overflow: visible;
    }

    .Cover.trim--s .blurb {
      top: 18%;
      min-height: 38%;
      max-height: 42%;
    }

    .Cover.Lang--es.trim--m .blurb {
      max-height: 41%;
    }

    .Cover.trim--m .blurb {
      max-height: 44%;
      min-height: 38%;
    }

    .Cover.trim--xl .blurb {
      top: 25%;
      max-height: 42%;
    }

    .prince .Cover .blurb {
      padding-bottom: 1em;
    }

    .Cover--scale-xs .blurb {
      font-size: 0;
      height: 40%;
    }

    .Cover--scale-xs .brackets {
      background-image: url('https://flp-assets.nyc3.digitaloceanspaces.com/static/cover/blurb.png');
      background-size: 75% 85%;
      background-repeat: no-repeat;
      background-position: center 69%;
    }

    ${sizingCss}
  `;

  return [staticCss, dynamifyCss(``, scope, scaler)];
};

export default blurb;
