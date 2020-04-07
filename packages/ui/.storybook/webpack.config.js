require('@friends-library/env/load');
const path = require('path');
const webpack = require('webpack');

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
      },
    ],
  });

  config.module.rules.push({
    test: /\.css$/,
    loaders: [
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true,
          config: {
            path: './.storybook/',
          },
        },
      },
    ],
    include: path.resolve(__dirname, '../'),
  });

  config.resolve.extensions.push('.ts', '.tsx');

  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.GATSBY_TEST_STRIPE_PUBLISHABLE_KEY': `"${process.env.GATSBY_TEST_STRIPE_PUBLISHABLE_KEY}"`,
      'process.env.GATSBY_PROD_STRIPE_PUBLISHABLE_KEY': `"${process.env.GATSBY_PROD_STRIPE_PUBLISHABLE_KEY}"`,
      'process.env.GATSBY_NETLIFY_CONTEXT': '""',
    }),
  );

  return config;
};
