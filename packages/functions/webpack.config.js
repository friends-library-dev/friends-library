const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    test: './src/test.ts',
    site: './src/site/site.ts',
    'zoe-order': '.src/zoe-order.ts',
  },
  target: 'node',
  mode: 'development',
  devtool: false,
  plugins: [new webpack.ContextReplacementPlugin(/.*/)],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
  },
};
