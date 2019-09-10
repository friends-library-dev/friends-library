const webpack = require('webpack');

process.env.NODE_ENV === 'development' && require('@friends-library/client/load-env');

module.exports = {
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
};
