module.exports = {
  "parser": "babel-eslint",
  "plugins": [
    "flowtype",
    "no-only-tests"
  ],
  "extends": [
    "airbnb",
    "plugin:flowtype/recommended"
  ],
  "globals": {
    "expect": false,
    "it": false,
    "describe": false,
    "beforeEach": false,
    "test": false
  },
  "rules": {
    "no-only-tests/no-only-tests": 2,
    "arrow-body-style": 0,
    "no-use-before-define": 0,
    "import/prefer-default-export": 0,
    "no-console": 0,
    "object-curly-newline": 0,
    "import/no-cycle": 0,
    "arrow-parens": 0,
    "no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }]
  },
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    },
  }
};
