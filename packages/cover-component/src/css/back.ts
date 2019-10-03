import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';
import blurbCss from './blurb';

const back: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const [blurbStaticCss, blurbSizeCss] = blurbCss({ size, pages }, scaler, scope);
  const staticCss = css`
    .Cover .back {
      position: relative;
    }

    .Cover .back .diamond {
      fill: white;
      left: 50%;
      top: 0;
      transform: translateX(-50%);
      position: absolute;
      width: 12%;
    }

    .Cover .back .about-flp {
      opacity: 0.8;
      /* font-size: 0.123in; */
      line-height: 160%;
      text-align: center;
    }

    .Cover .back .purpose,
    .Cover .back .website {
      box-sizing: border-box;
      left: 0;
      width: 100%;
      position: absolute;
    }

    .Cover .back .purpose {
      padding: 0 10%;
      bottom: 19%;
    }

    .Cover .back .website {
      bottom: 14%;
      /* margin-top: 0.175in; */
    }

    .Cover.trim--s .back .purpose {
      bottom: 18.25%;
      padding: 0 7%;
      line-height: 145%;
      /* font-size: 0.12in; */
    }

    .Cover.trim--s .back .website {
      line-height: 142%;
      /* bottom: 0.425in; */
      /* left: 0.03in; */
      width: 65%;
      text-align: left;
      position: absolute;
    }

    .Cover .back .logo {
      color: white;
      height: 4.5%;
      position: absolute;
      bottom: 2.25%;
      left: 2.5%;
    }

    .Cover .back .logo--spanish {
      height: 5.2%;
      bottom: 1.4%;
    }

    .Cover.trim--s .back .logo {
      bottom: 0.75%;
      left: 1%;
    }

    .Cover.trim--s .back .logo--spanish {
      bottom: -0.1%;
    }

    .Cover .back .isbn {
      /* width: 1.25in; */
      background: white;
      /* padding: 0.075in; */
      position: absolute;
      bottom: 2.25%;
      right: 0;
    }

    .Cover.trim--s .back .isbn {
      bottom: 0.75%;
      transform: scaleX(0.9);
    }

    ${blurbStaticCss}
  `;

  return [staticCss, dynamifyCss(blurbSizeCss, scope, scaler)];
};

export default back;
