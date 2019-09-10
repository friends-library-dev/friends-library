module.exports = {
  presets: ['babel-preset-gatsby'],
  plugins: [
    [
      'babel-plugin-ttag',
      {
        resolve: {
          translations: process.env.GATSBY_LANG === 'es' ? 'es.po' : 'default',
        },
      },
    ],
  ],
};
