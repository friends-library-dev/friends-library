const { fontFamily } = require('tailwindcss/defaultTheme');

const LANG = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';
const maroonRgb = '108, 49, 66';
const goldRgb = '193, 140, 89';
const blackRgb = '45, 42, 41';
const grayRgb = '107, 108, 108';
const blueRgb = '95, 140, 158';
const greenRgb = '157, 157, 128';

module.exports = {
  theme: {
    rgb: {
      flprimary: LANG === 'en' ? maroonRgb : goldRgb,
      flmaroon: maroonRgb,
      flgold: goldRgb,
      flblack: blackRgb,
      flgray: grayRgb,
      flblue: blueRgb,
      flgreen: greenRgb,
    },
    fontFamily: {
      sans: ['Cabin'].concat(fontFamily.sans),
      serif: ['Baskerville'].concat(fontFamily.serif),
      mono: fontFamily.mono,
    },
    extend: {
      colors: {
        flprimary: `rgb(${LANG === 'en' ? maroonRgb : goldRgb})`,
        flgold: `rgb(${goldRgb})`,
        flmaroon: `rgb(${maroonRgb})`,
        flblue: `rgb(${blueRgb})`,
        flgreen: `rgb(${greenRgb})`,
        flgray: `rgb(${grayRgb})`,
        flblack: `rgb(${blackRgb})`,
      },
    },
  },
  variants: {},
  plugins: [],
};
