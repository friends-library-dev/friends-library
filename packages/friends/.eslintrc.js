module.exports = {
  "parser": "babel-eslint",
  "plugins": ["flowtype"],
  "extends": ["airbnb", "plugin:flowtype/recommended"],
  "globals": {
    "expect": false,
    "it": false,
    "describe": false,
    "beforeEach": false,
    "test": false
  },
};
