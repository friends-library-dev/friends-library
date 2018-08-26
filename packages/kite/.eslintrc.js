const config = require('../../.eslintrc.js');

config.rules = {
  ...config.rules,
  "no-console": 0,
  "no-param-reassign": 0,
  "no-cond-assign": 0,
};

module.exports = config;
