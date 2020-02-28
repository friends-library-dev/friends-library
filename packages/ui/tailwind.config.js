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
        'flprimary-800': `rgb(${LANG === 'en' ? '88, 44, 56' : '162, 112, 67'})`,
        flgold: `rgb(${goldRgb})`,
        flmaroon: `rgb(${maroonRgb})`,
        flblue: `rgb(${blueRgb})`,
        flgreen: `rgb(${greenRgb})`,
        flgray: `rgb(${grayRgb})`,
        flblack: `rgb(${blackRgb})`,
        'flmaroon-800': `rgb(88, 44, 56)`,
        'flmaroon-600': `rgb(${maroonRgb})`,
        'flmaroon-500': 'rgb(132, 60, 81)',
        'flmaroon-400': `rgb(147, 64, 89)`,
        'flgreen-800': 'rgb(142, 142, 113)',
        'flgreen-700': 'rgb(152, 152, 123)',
        'flgreen-600': `rgb(${greenRgb})`,
        'flgreen-400': 'rgb(193, 193, 139)',
        'flblue-800': 'rgb(72, 105, 118)',
        'flblue-700': 'rgb(73, 112, 127)',
        'flblue-600': `rgb(${blueRgb})`,
        'flblue-400': 'rgb(152, 200, 220)',
        'flgold-800': 'rgb(162, 112, 67)',
        'flgold-600': `rgb(${goldRgb})`,
        'flgold-400': 'rgb(172, 127, 85)',
        'flgray-900': 'rgb(44, 42, 41)',
        'flgray-500': 'rgb(146, 146, 146)',
        'flgray-400': 'rgb(218, 218, 218)',
        'flgray-300': 'rgb(233, 233, 233)',
        'flgray-200': 'rgb(241, 241, 241)',
        'flgray-100': 'rgb(249, 249, 249)',
      },
      fontSize: {
        '1-5xl': '1.375rem',
        '2-5xl': '1.6875rem',
        '3-5xl': '2.0625rem',
      },
      boxShadow: {
        btn: 'rgba(0, 0, 0, 0.15) 0px 0px 10px 4px',
        direct:
          '0 -7px 25px -5px rgba(0, 0, 0, 0.1), 0 15px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  variants: {},
  plugins: [],
};
