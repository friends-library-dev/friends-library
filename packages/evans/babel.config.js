module.exports = {
  presets: [
    'babel-preset-gatsby',
    ...(process.argv[1].endsWith('netlify-lambda') ? ['@babel/preset-typescript'] : []),
  ],
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
