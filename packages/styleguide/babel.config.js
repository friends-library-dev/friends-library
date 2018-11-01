const config = require('../../babel.config.js');

config.presets = [...config.presets, '@babel/preset-react'];

config.plugins = [
  ...config.plugins,
  'babel-plugin-styled-components',
  'react-hot-loader/babel',
];

module.exports = config;
