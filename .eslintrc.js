module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype', 'no-only-tests'],
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  globals: {
    expect: false,
    it: false,
    describe: false,
    beforeEach: false,
    document: false,
    test: false,
    jest: false,
  },
  rules: {
    'no-only-tests/no-only-tests': 2,
    'arrow-body-style': 0,
    'object-curly-newline': 0,
    'no-use-before-define': 0,
    'import/prefer-default-export': 0,
    'arrow-parens': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'react/jsx-filename-extension': [0],
    'no-cond-assign': 0,
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'lines-between-class-members': [
      'error',
      'always',
      { exceptAfterSingleLine: true },
    ],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
};
