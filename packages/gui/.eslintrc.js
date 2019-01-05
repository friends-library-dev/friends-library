const config = require('../../.eslintrc.js');

config.globals = {
  ...config.globals,
  fetch: true,
  localStorage: true,
};

config.rules = {
  ...config.rules,
  "jsx-a11y/anchor-is-valid": 0,
  "jsx-a11y/click-events-have-key-events": 0,
  "jsx-a11y/no-static-element-interactions": 0,
  "jsx-a11y/no-noninteractive-element-interactions": 0,
  "import/no-extraneous-dependencies": 0,
};

module.exports = config;
