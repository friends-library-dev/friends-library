const webpack = require('webpack');

process.env.NODE_ENV === 'development' && require('@friends-library/env/load');

module.exports = {
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
};
