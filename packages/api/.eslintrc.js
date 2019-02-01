const config = require('../../.eslintrc.js');

config.rules = {
  ...config.rules,
  "no-console": 0,
  "camelcase": 0,
};

module.exports = config;
