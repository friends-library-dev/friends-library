module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'no-only-tests'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'react-app',
  ],
  rules: {
    'no-var': 'off',
    'default-case': 'off',
    'react/no-unescaped-entities': 'error',
    'no-only-tests/no-only-tests': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIngorePattern: '^_' }],
    'no-unused-vars': 'off',
    camelcase: 'off',
    '@typescript-eslint/camelcase': [
      'error',
      {
        properties: 'never',
        ignoreDestructuring: true,
        allow: ['access_token'],
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['**/__tests__/**'],
      rules: {
        'no-throw-literal': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/consistent-type-assertions': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/packages/styleguide/**', '**/packages/ui/stories/**'],
      rules: {
        'jsx-a11y/accessible-emoji': 'off',
        'react/no-unescaped-entities': 'off',
      },
    },
    {
      files: ['**/packages/jones/**'],
      rules: {
        'jsx-a11y/accessible-emoji': 'off',
        'react/no-unescaped-entities': 'off',
      },
    },
    {
      files: ['**/packages/doc-manifests/**'],
      rules: {
        'react-hooks/rules-of-hooks': 'off',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: { jsx: true },
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
