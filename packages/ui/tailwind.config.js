const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  theme: {
    rgb: {
      flmaroon: '108, 49, 66',
    },
    fontFamily: {
      sans: [
        'Cabin',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        '"Noto Sans"',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
      serif: ['Baskerville', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
      mono: fontFamily.mono,
    },
    extend: {
      colors: {
        flgold: '#C18C59',
        flmaroon: '#6C3142',
        flblue: '#628C9D',
        flgreen: '#9D9D80',
      },
    },
  },
  variants: {},
  plugins: [],
};
