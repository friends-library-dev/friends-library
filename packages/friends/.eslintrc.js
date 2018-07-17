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
    "arrow-body-style": 0
  },
  "settings": {
    "flowtype": {
      "onlyFilesWithFlowAnnotation": true
    },
  }
};
