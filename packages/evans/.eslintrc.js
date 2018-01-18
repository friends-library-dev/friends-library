module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      generators: true,
      experimentalObjectRestSpread: true
    },
    sourceType: 'module',
    allowImportExportEverywhere: false
  },
  plugins: ['flowtype', 'no-only-tests'],
  extends: ['airbnb', 'plugin:flowtype/recommended'],
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true
    },
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.json', '.css']
      }
    }
  },
  globals: {
    window: true,
    document: true,
    __dirname: true,
    __DEV__: true,
    CONFIG: true,
    process: true,
    jest: true,
    describe: true,
    test: true,
    it: true,
    expect: true,
    beforeEach: true,
    fetch: true,
  },
  rules: {
    "react/jsx-filename-extension": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/click-events-have-key-events": 0,
    "jsx-a11y/interactive-supports-focus": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}],
    "arrow-body-style": 0,
    "no-only-tests/no-only-tests": 2,
    "react/no-danger": 0,
  }
}
