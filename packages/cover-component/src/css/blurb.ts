import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const blurb: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss: string = css`
    .back .diamond {
      top: 19%;
    }

    .trim--s .back .diamond {
      top: 13%;
    }

    .brackets {
      fill: white;
      position: absolute;
      opacity: 0.32;
      top: 28%;
      left: 50%;
      transform: translateX(-50%);
      width: 92%;
    }

    .trim--s .brackets {
      top: 23%;
      width: 90%;
      transform: translateX(-50%) scaleY(1.3);
    }

    .blurb {
      box-sizing: border-box;
      cursor: text;
      min-height: 2in;
      padding: 0 19.5% 0 19.5%;
      position: absolute;
      top: 29%;
      width: 100%;
      font-size: 0.15in;
      line-height: 160%;
      text-align: center;
      z-index: 100000;
      overflow: hidden;
    }

    .trim--s .blurb {
      top: 22%;
    }

    [contenteditable]:focus {
      outline: 0px solid transparent;
      max-height: none !important;
    }

    /* --------------------------------------------------------- */
    /* ---- LESS-THAN classes (must go from large to small) ---- */
    /* --------------------------------------------------------- */

    /* ----- < 350 ----- */
    .trim--s .blurb--lt-350 .brackets {
      top: 25%;
    }

    .trim--s .blurb--lt-350 .blurb {
      font-size: 0.145in;
    }

    .trim--m .blurb--lt-350 .brackets {
      width: 86%;
    }

    .trim--m .blurb--lt-350 .blurb {
      font-size: 0.1675in;
      padding: 0 22.5%;
      top: 29.3%;
    }

    .trim--m .blurb--lt-350 .purpose,
    .trim--m .blurb--lt-350 .website {
      transform: translateY(-0.22in);
    }

    .trim--xl .blurb--lt-350 .brackets {
      width: 83%;
    }

    .trim--xl .blurb--lt-350 .diamond {
      top: 20%;
    }

    .trim--xl .blurb--lt-350 .blurb {
      font-size: 0.175in;
      padding: 0 22.5%;
      top: 29.6%;
    }

    .trim--xl .blurb--lt-350 .purpose,
    .trim--xl .blurb--lt-350 .website {
      transform: translateY(-0.22in);
    }

    /* ----- < 300 ----- */
    .trim--s .blurb--lt-300 .brackets {
      top: 23.8%;
      transform: translateX(-50%) scaleY(1.22);
    }

    .trim--s .blurb--lt-300 .diamond {
      top: 14.5%;
    }

    .trim--s .blurb--lt-300 .blurb {
      font-size: 0.16in;
      top: 22.5%;
    }

    .trim--m .blurb--lt-300 .brackets {
      width: 83%;
      transform: translateX(-50%) scaleY(1.075);
    }

    .trim--m .blurb--lt-300 .diamond {
      top: 20%;
    }

    .trim--m .blurb--lt-300 .blurb {
      font-size: 0.18in;
      padding: 0 22.5%;
      top: 29.5%;
    }

    .trim--m .blurb--lt-300 .purpose,
    .trim--m .blurb--lt-300 .website {
      transform: translateY(-0.22in);
    }

    /* ----- < 250 ----- */
    .trim--s .blurb--lt-250 .blurb {
      font-size: 0.17in;
    }

    .trim--s .blurb--lt-250 .purpose {
      transform: translateY(-0.1in);
    }

    /* ------------------------------------------------------------ */
    /* ---- GREATER-THAN classes (must go from small to large) ---- */
    /* ------------------------------------------------------------ */

    /* ----- >= 400 ----- */
    .trim--m .blurb--gte-400 .blurb {
      font-size: 0.161in;
    }

    .trim--m .blurb--gte-400 .brackets {
      width: 88%;
      transform: translateX(-50%) scaleY(1.15);
    }

    /* ----- >= 425 ----- */
    .trim--s .blurb--gte-425 .diamond {
      top: 12%;
    }

    .trim--s .blurb--gte-425 .brackets {
      top: 22.85%;
      transform: translateX(-50%) scaleY(1.35);
    }

    .trim--s .blurb--gte-425 .blurb {
      top: 20.5%;
      padding: 0 17%;
      font-size: 0.135in;
      max-height: 2.55in;
    }

    .trim--m .blurb--gte-425 .blurb {
      top: 28%;
    }

    /* ----- >= 450 ----- */
    .trim--s .blurb--gte-450 .diamond {
      top: 12%;
    }

    .trim--s .blurb--gte-450 .brackets {
      top: 24.5%;
      transform: translateX(-50%) scaleY(1.45);
    }

    .trim--s .blurb--gte-450 .blurb {
      top: 20%;
      padding: 0 18%;
      font-size: 0.135in;
      max-height: 2.55in;
    }

    .trim--m .blurb--gte-450 .blurb {
      padding: 0 17.8%;
      top: 30.25%;
      font-size: 0.1585in;
    }

    .trim--m .blurb--gte-450 .diamond {
      top: 20.5%;
    }

    /* ----- >= 475 ----- */
    .trim--m .blurb--gte-475 .brackets {
      width: 90%;
      transform: translateX(-50%) scaleY(1.15);
    }

    .trim--m .blurb--gte-475 .blurb {
      top: 28%;
    }

    /* ----- >= 525 ----- */
    .trim--m .blurb--gte-525 .diamond {
      top: 18.5%;
    }

    /* ----- >= 550 ----- */
    .trim--m .blurb--gte-550 .diamond {
      top: 18.75%;
    }

    .trim--m .blurb--gte-550 .brackets {
      top: 29%;
      transform: translateX(-50%) scaleY(1.23);
    }

    .trim--m .blurb--gte-550 .blurb {
      font-size: 0.154in;
    }

    /* ----- >= 575 ----- */
    .trim--m .blurb--gte-575 .brackets {
      top: 28.75%;
      transform: translateX(-50%) scaleY(1.22);
    }

    .trim--m .blurb--gte-575 .blurb {
      font-size: 0.151in;
    }

    /* ----- >= 600 ----- */
    .trim--m .blurb--gte-600 .diamond {
      top: 17.5%;
    }

    .trim--m .blurb--gte-600 .brackets {
      top: 28.75%;
      transform: translateX(-50%) scaleY(1.3);
    }

    .trim--m .blurb--gte-600 .blurb {
      font-size: 0.151in;
      top: 26.6%;
      padding: 0 18%;
    }

    /* ----- >= 625 ----- */
    .trim--m .blurb--gte-625 .diamond {
      top: 17.8%;
    }

    .trim--m .blurb--gte-625 .brackets {
      transform: translateX(-50%) scaleY(1.3);
    }

    .trim--m .blurb--gte-625 .blurb {
      top: 27%;
    }

    /* ----- >= 650 ----- */
    .trim--m .blurb--gte-650 .diamond {
      top: 17.5%;
    }

    .trim--m .blurb--gte-650 .brackets {
      top: 27%;
      transform: translateX(-50%) scaleY(1.18);
    }

    .trim--m .blurb--gte-650 .blurb {
      top: 26%;
      padding: 0 17%;
      font-size: 0.145in;
    }

    /* ----- >= 675 ----- */
    .trim--m .blurb--gte-675 .brackets {
      top: 27.4%;
      transform: translateX(-50%) scaleY(1.27);
    }

    /* ----- >= 700 ----- */
    .trim--m .blurb--gte-700 .brackets {
      top: 28%;
      transform: translateX(-50%) scaleY(1.265);
    }

    /* ----- >= 725 ----- */
    .trim--m .blurb--gte-725 .diamond {
      top: 17%;
    }

    .trim--m .blurb--gte-725 .brackets {
      top: 28.1%;
      transform: translateX(-50%) scaleY(1.34);
    }

    .trim--m .blurb--gte-725 .blurb {
      top: 25%;
      font-size: 0.145in;
      padding: 0 18.7%;
      max-height: 3.1in;
    }

    .trim--xl .blurb--gte-725 .diamond {
      top: 19%;
    }

    .trim--xl .blurb--gte-725 .brackets {
      top: 28.5%;
      transform: translateX(-50%) scaleY(1.2);
    }

    .trim--xl .blurb--gte-725 .blurb {
      top: 27.5%;
      font-size: 0.145in;
      padding: 0 18%;
      max-height: 3.1in;
    }

    .trim--xl .blurb--gte-725 .purpose,
    .trim--xl .blurb--gte-725 .website {
      transform: translateY(0.05in);
    }
  `;

  return [staticCss, dynamifyCss('', scope, scaler)];
};

export default blurb;
