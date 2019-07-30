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
    'default-case': 'off',
    'no-only-tests/no-only-tests': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
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
    '@typescript-eslint/no-object-literal-type-assertion': [
      'error',
      {
        allowAsParameter: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-object-literal-type-assertion': 'off',
      },
    },
    {
      files: ['**/packages/styleguide/**', '**/packages/ui/stories/**'],
      rules: {
        'jsx-a11y/accessible-emoji': 'off',
      },
    },
    {
      files: ['**/packages/jones/**'],
      rules: {
        'jsx-a11y/accessible-emoji': 'off',
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
