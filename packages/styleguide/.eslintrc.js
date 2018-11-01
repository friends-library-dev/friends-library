const config = require('../../.eslintrc.js');

config.rules = {
  ...config.rules,
  "react/jsx-closing-tag-location": 0,
  "react/no-unescaped-entities": 0,
  "jsx-a11y/accessible-emoji": 0,
};

module.exports = config;
