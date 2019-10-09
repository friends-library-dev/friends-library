import { CoverCssModule } from './types';
import { css } from './helpers';
import initials from './initials';

const frontMain: CoverCssModule = (props, scaler, scope) => {
  const [initialsCss, initialsDynamicCss] = initials(props, scaler, scope);
  const staticCss = css`
    .front__main {
      position: relative;
    }

    .front__main .title-wrap,
    .front__main .initials {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
    }

    .front__main .title-wrap {
      justify-content: center;
      text-align: center;
    }

    .front__main .title-wrap .title {
      margin-right: -6%;
      margin-left: -6%;
      width: 163%;
      line-height: 200%;
      font-size: 18%;
      transform: translateX(-15.75%) scale(0.46);
      transform-origin: center center;
      letter-spacing: 0.0335em;
    }

    .trim--xl .front__main .title-wrap .title,
    .trim--m .front__main .title-wrap .title {
      font-size: 13.88%;
    }

    ${initialsCss}
  `;

  const guideCss = css`
    .Cover--show-guides .guide--letter-spacing {
      width: 70%;
      height: 0.18in;
      margin: 0 15%;
      border-top: 1px dashed green !important;
      border-bottom: 1px dashed green !important;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    .Cover--show-guides .guide--front-vertical-center {
      left: 50%;
      border-color: green !important;
    }
  `;

  const dynamicCss = css`
    .Cover.trim--s .front__main {
      height: 4in;
    }

    .Cover.trim--m .front__main {
      height: 4.825in;
    }

    .Cover.trim--xl .front__main {
      height: 4.7in;
    }

    ${initialsDynamicCss}
    ${props.showGuides ? guideCss : ''}
  `;

  return [staticCss, dynamicCss];
};

export default frontMain;
