import { CoverCssModule } from './types';
import { css, dynamifyCss } from './helpers';

const blurb: CoverCssModule = (_, scaler, scope) => {
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
      padding: 1.4em 3.5em 0.5em 3.5em;
      cursor: text;
      margin: 0 8%;
      position: relative;
      top: 23%;
      font-size: 2.9%;
      line-height: 160%;
      text-align: center;
      z-index: 100000;
      overflow: hidden;
    }

    .Cover.trim--s .blurb {
      top: 18%;
    }

    .Cover.trim--xl .blurb {
      top: 25%;
    }

    .prince .Cover .blurb {
      padding-bottom: 1em;
    }

    .Cover--scale-xs .blurb {
      font-size: 0;
      height: 40%;
    }

    .Cover--scale-xs .brackets {
      background-image: url('https://friends-library-assets.nyc3.digitaloceanspaces.com/en/ambrose-rigge/journal-and-writings/modernized/blurb.png');
      background-size: 75% 85%;
      background-repeat: no-repeat;
      background-position: center 69%;
    }
  `;

  return [staticCss, dynamifyCss('', scope, scaler)];
};

export default blurb;
