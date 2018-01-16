const path = require('path');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

module.exports = {
  entry: {
    app: path.resolve(__dirname, './src/client/entry.js'),
  },
  output: {
    path: path.resolve(__dirname, './static/js'),
    filename: `bundle${TARGET === 'prebuild' ? '.min' : ''}.js`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ["env", {
                targets: {
                  browsers: ["last 2 versions"]
                }
              }]
            ]
          }
        }
      }
    ]
  },
};
