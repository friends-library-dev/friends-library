const config = require('../../.eslintrc.js');

config.globals = {
  ...config.globals,
  document: true,
  window: true,
};

config.rules = {
  ...config.rules,
  "max-len": 0,
  "react/no-unescaped-entities": 0,
  "jsx-a11y/anchor-is-valid": 0,
  "jsx-a11y/click-events-have-key-events": 0,
  "jsx-a11y/interactive-supports-focus": 0,
  "jsx-a11y/no-static-element-interactions": 0,
  "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
};

module.exports = config;
