import css from './tmpl';

const initialsCss: string = css`
  .initials > div {
    width: 100%;
    height: 50%;
    position: relative;
  }

  .initial--first {
    bottom: -0.39in;
  }

  .initial--last {
    bottom: auto;
    top: -0.39in;
  }

  .trim--s .initial--first {
    bottom: -0.56in;
  }

  .trim--s .initial--last {
    bottom: auto;
    top: -0.55in;
  }

  .initial {
    width: 100%;
    text-align: center;
    position: absolute;
    margin: 0;
    padding: 0;
    color: white;
    opacity: 0.25;
    font-size: 3.05in;
    line-height: 3.05in;
    font-weight: 400;
    left: 0;
  }

  .trim--s .initial {
    font-size: 2.55in;
  }

  /* LETTER TWEAKS */
  .initial--first.initial--A {
    bottom: -0.44in;
  }

  .initials--CM.initial--C,
  .initials--CH.initial--C {
    transform: scaleX(1.1);
  }

  .initial--last.initial--C {
    top: -0.36in;
  }

  .trim--s .initial--last.initial--C {
    top: -0.525in;
  }

  .initials--SC.initial--C {
    transform: scaleX(0.9) translateX(-0.05in);
  }

  .initials--DB.initial--B {
    transform: scaleX(1.1);
  }

  .initials--RB.initial--B {
    transform: scaleX(1.1) translateX(0.15in);
  }

  .initial--D {
    transform: translateX(0.08in);
  }

  .initials--DF.initial--D {
    transform: translateX(0.08in) scaleX(0.88);
  }

  .initial--first.initial--D {
    bottom: -0.435in;
  }

  .trim--s .initial--first.initial--D {
    bottom: -0.585in;
  }

  .initials--DW.initial--D {
    bottom: -0.34in;
    transform: translateX(0.08in) scale(1.1);
  }

  .initials--MD.initial--D {
    transform: scaleX(1.1);
  }

  .initial--JX {
    transform: scaleX(0.87);
  }

  .initials--JS.initial--S {
    transform: scale(1);
  }

  .initial--first.initial--E {
    bottom: -0.44in;
  }

  .trim--s .initial--first.initial--E {
    bottom: -0.585in;
  }

  .initials--EW.initial--E {
    transform: scaleX(1.08);
  }

  .initial--last.initial--G {
    top: -0.35in;
  }

  .trim--s .initial--last.initial--G {
    top: -0.535in;
  }

  .trim--s .initial--first.initial--F {
    bottom: -0.59in;
  }

  .initials--GF.initial--F {
    transform: scaleX(1.14) translateX(-0.1in);
  }

  .initials--MG.initial--G {
    transform: scaleX(1.075);
  }

  .initials--SG.initial--G {
    transform: scaleX(0.88);
  }

  .initial--first.initial--H {
    bottom: -0.43in;
  }

  .trim--s .initial--first.initial--H {
    bottom: -0.585in;
  }

  .initials--FH.initial--H {
    transform: scaleX(0.8) scaleY(0.875);
    top: -0.52in;
  }

  .trim--s .initials--FH.initial--H {
    top: -0.675in;
  }

  .initials--HT.initial--H {
    transform: scaleX(0.88);
  }

  .initials--RH.initial--H {
    transform: translateX(0);
  }

  .initial--first.initial--I {
    transform: scaleX(1.15);
    bottom: -0.44in;
  }

  .initials--TK.initial--K {
    transform: scaleX(0.88);
  }

  .initial--J {
    transform: scaleY(0.78) translateY(-0.22in) translateX(-0.02in);
  }

  .initial--first.initial--J {
    bottom: -0.28in;
  }

  .trim--s .initial--first.initial--J {
    bottom: -0.465in;
  }

  .initial--last.initial--J {
    top: -0.46in;
  }

  .initials--RJ.initial--J {
    transform: scaleY(0.78) translateY(-0.22in) translateX(0.15in);
  }

  .initial--M {
    transform: scaleX(0.9);
  }

  .initial--first.initial--M {
    transform: scaleX(0.9) translateY(0.04in);
  }

  .initials--SN.initial--N {
    transform: scaleX(0.88);
  }

  .initial--last.initial--P {
    top: -0.37in;
  }

  .trim--s .initial--last.initial--P {
    top: -0.555in;
  }

  .initials--CP.initial--P {
    transform: scaleX(1.18);
  }

  .initials--JP.initial--P {
    top: -0.31in;
    transform: scaleX(0.9) scaleY(1.075) translateX(-0.15in);
  }

  .trim--m .initials--JP.initial--P {
    top: -0.36in;
    transform: scaleX(0.9) scaleY(1.025) translateX(-0.15in);
  }

  .trim--s .initials--JP.initial--P {
    top: -0.488in;
  }

  .initials--WP.initial--P {
    transform: scaleX(1.1) translateX(-0.075in);
  }

  .initial--first.initial--R {
    bottom: -0.43in;
    transform: translateX(0.18in);
  }

  .trim--s .initial--first.initial--R {
    bottom: -0.585in;
  }

  .initials--MR.initial--R {
    transform: scaleX(1.15);
  }

  .initial--RX {
    transform: translateX(0.25in);
  }

  .initials--SR.initial--R {
    transform: translateX(0.11in) scaleX(0.9);
  }

  .initials--RH.initial--R {
    transform: translateX(-0.05in) scaleX(1.06);
  }

  .initial--last.initial--S {
    top: -0.35in;
  }

  .trim--s .initial--last.initial--S {
    top: -0.535in;
  }

  .initial--S {
    transform: scaleX(1.2);
  }

  .initial--first.initial--T {
    transform: translateY(0.026in);
  }

  .initial--W {
    transform: scaleX(0.85) scaleY(0.95);
  }

  .initial--first.initial--W {
    bottom: -0.44in;
    transform: scaleX(0.85) scaleY(0.95) translateX(-0.09in);
  }

  .trim--s .initial--first.initial--W {
    bottom: -0.588in;
  }

  .initial--last.initial--W {
    top: -0.46in;
  }

  .trim--s .initial--last.initial--W {
    top: -0.61in;
  }

  /* SPECIAL STUFF */
  .front__main--first-initial--J .initials__top {
    transform: translateX(0.21in);
  }

  .front__main--initials--RD .initials,
  .front__main--initials--RB .initials {
    transform: translateX(-0.11in);
  }

  .trim--xl .front__main--initials--TS {
    margin-bottom: 0.2in;
  }
`;

export default initialsCss;
