import { CoverCssModule } from './types';
import { css } from './helpers';
import { initials } from '../helpers';

const initialsCss: CoverCssModule = ({ author }, scaler, scope) => {
  const staticCss = css`
    .front__main {
      /* background: rgba(0, 255, 0, 0.2); */
    }

    .Cover .front__main .initials > div {
      flex-grow: 1;
      position: relative;
    }

    .Cover .front__main .initial {
      width: 100%;
      text-align: center;
      position: absolute;
      margin: 0;
      padding: 0;
      color: white;
      opacity: 0.25;
      font-weight: 400;
      left: 0;
    }

    .initial--last {
      bottom: auto;
    }
  `;

  let dynamicCss = css`
    .Cover .front__main .initial {
      font-size: 3.05in;
      line-height: 3.05in;
    }

    .Cover.trim--s .initial {
      font-size: 2.55in;
    }

    .Cover .initial--first {
      bottom: -0.39in;
    }

    .Cover .initial--last {
      top: -0.39in;
    }

    .Cover.trim--s .initial--first {
      bottom: -0.56in;
    }

    .Cover.trim--s .initial--last {
      top: -0.55in;
    }
  `;

  const dynamicCssParts = css`
    /* LETTER TWEAKS */
    .Cover .initial--first.initial--A {
      bottom: -0.44in;
    }

    .Cover .initials--CM.initial--C,
    .Cover .initials--CH.initial--C {
      transform: scaleX(1.1);
    }

    .Cover .initial--last.initial--C {
      top: -0.36in;
    }

    .Cover.trim--s .initial--last.initial--C {
      top: -0.525in;
    }

    .Cover .initials--SC.initial--C {
      transform: scaleX(0.9) translateX(-0.05in);
    }

    .Cover .initials--DB.initial--B {
      transform: scaleX(1.1);
    }

    .Cover .initials--RB.initial--B {
      transform: scaleX(1.1) translateX(0.15in);
    }

    .Cover .initial--D {
      transform: translateX(0.08in);
    }

    .Cover .initials--DF.initial--D {
      transform: translateX(0.08in) scaleX(0.88);
    }

    .Cover .initial--first.initial--D {
      bottom: -0.435in;
    }

    .Cover.trim--s .initial--first.initial--D {
      bottom: -0.585in;
    }

    .Cover .initials--DW.initial--D {
      bottom: -0.34in;
      transform: translateX(0.08in) scale(1.1);
    }

    .Cover .initials--MD.initial--D {
      transform: scaleX(1.1);
    }

    .Cover .initial--JX {
      transform: scaleX(0.87);
    }

    .Cover .initials--JS.initial--S {
      transform: scale(1);
    }

    .Cover .initial--first.initial--E {
      bottom: -0.44in;
    }

    .Cover.trim--s .initial--first.initial--E {
      bottom: -0.585in;
    }

    .Cover .initials--EW.initial--E {
      transform: scaleX(1.08);
    }

    .Cover .initial--last.initial--G {
      top: -0.35in;
    }

    .Cover.trim--s .initial--last.initial--G {
      top: -0.535in;
    }

    .Cover.trim--s .initial--first.initial--F {
      bottom: -0.59in;
    }

    .Cover .initials--GF.initial--F {
      transform: scaleX(1.14) translateX(-0.1in);
    }

    .Cover .initials--MG.initial--G {
      transform: scaleX(1.075);
    }

    .Cover .initials--SG.initial--G {
      transform: scaleX(0.88);
    }

    .Cover .initial--first.initial--H {
      bottom: -0.43in;
    }

    .Cover.trim--s .initial--first.initial--H {
      bottom: -0.585in;
    }

    .Cover .initials--FH.initial--H {
      transform: scaleX(0.8) scaleY(0.875);
      top: -0.52in;
    }

    .Cover.trim--s .initials--FH.initial--H {
      top: -0.675in;
    }

    .Cover .initials--HT.initial--H {
      transform: scaleX(0.88);
    }

    .Cover .initials--RH.initial--H {
      transform: translateX(0);
    }

    .Cover .initial--first.initial--I {
      transform: scaleX(1.15);
      bottom: -0.44in;
    }

    .Cover .initials--TK.initial--K {
      transform: scaleX(0.88);
    }

    .Cover .initial--J {
      transform: scaleY(0.78) translateY(-0.22in) translateX(-0.02in);
    }

    .Cover .initial--first.initial--J {
      bottom: -0.28in;
    }

    .Cover.trim--s .initial--first.initial--J {
      bottom: -0.465in;
    }

    .Cover .initial--last.initial--J {
      top: -0.46in;
    }

    .Cover .initials--RJ.initial--J {
      transform: scaleY(0.78) translateY(-0.22in) translateX(0.15in);
    }

    .Cover .initial--M {
      transform: scaleX(0.9);
    }

    .Cover .initial--first.initial--M {
      transform: scaleX(0.9) translateY(0.04in);
    }

    .Cover .initials--SN.initial--N {
      transform: scaleX(0.88);
    }

    .Cover .initial--last.initial--P {
      top: -0.37in;
    }

    .Cover.trim--s .initial--last.initial--P {
      top: -0.555in;
    }

    .Cover .initials--CP.initial--P {
      transform: scaleX(1.18);
    }

    .Cover .initials--JP.initial--P {
      top: -0.31in;
      transform: scaleX(0.9) scaleY(1.075) translateX(-0.15in);
    }

    .Cover.trim--m .initials--JP.initial--P {
      top: -0.36in;
      transform: scaleX(0.9) scaleY(1.025) translateX(-0.15in);
    }

    .Cover.trim--s .initials--JP.initial--P {
      top: -0.488in;
    }

    .Cover .initials--WP.initial--P {
      transform: scaleX(1.1) translateX(-0.075in);
    }

    .Cover .initial--first.initial--R {
      bottom: -0.43in;
      transform: translateX(0.18in);
    }

    .Cover.trim--s .initial--first.initial--R {
      bottom: -0.585in;
    }

    .Cover .initials--MR.initial--R {
      transform: scaleX(1.15);
    }

    .Cover .initial--RX {
      transform: translateX(0.25in);
    }

    .Cover .initials--SR.initial--R {
      transform: translateX(0.11in) scaleX(0.9);
    }

    .Cover .initials--RH.initial--R {
      transform: translateX(-0.05in) scaleX(1.06);
    }

    .Cover .initial--last.initial--S {
      top: -0.35in;
    }

    .Cover.trim--s .initial--last.initial--S {
      top: -0.535in;
    }

    .Cover .initial--S {
      transform: scaleX(1.2);
    }

    .Cover .initial--first.initial--T {
      transform: translateY(0.026in);
    }

    .Cover .initial--W {
      transform: scaleX(0.85) scaleY(0.95);
    }

    .Cover .initial--first.initial--W {
      bottom: -0.44in;
      transform: scaleX(0.85) scaleY(0.95) translateX(-0.09in);
    }

    .Cover.trim--s .initial--first.initial--W {
      bottom: -0.588in;
    }

    .Cover .initial--last.initial--W {
      top: -0.46in;
    }

    .Cover.trim--s .initial--last.initial--W {
      top: -0.61in;
    }

    /* SPECIAL STUFF */
    .Cover .front__main--first-initial--J .initials__top {
      transform: translateX(0.21in);
    }

    .Cover .front__main--initials--RD .initials,
    .Cover .front__main--initials--RB .initials {
      transform: translateX(-0.11in);
    }

    .Cover.trim--xl .front__main--initials--TS {
      margin-bottom: 0.2in;
    }
  `.split('\n\n');

  const [first, last] = initials(author);

  dynamicCss += dynamicCssParts
    .filter(part => {
      const singleLine = part.replace(/\n/g, ' ').replace(/\/\*.+\*\//, '');
      const selectors = singleLine.replace(/{.+/m, '');
      return selectors.includes(first) || selectors.includes(last);
    })
    .join('\n\n');

  return [staticCss, dynamicCss];
};

export default initialsCss;
