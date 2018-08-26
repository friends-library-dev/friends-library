const glamor = require('glamor/babel');
const config = require('../../babel.config.js');

config.presets = [
  ...config.presets,
  '@babel/preset-react',
];

config.plugins = [
  ...config.plugins,
  () => glamor,
];

module.exports = config;
