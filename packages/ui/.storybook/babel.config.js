// created this because of trouble when i was typescript-ifying the
// tailwind.config.js file, might be possible to remove at some point
// this whole file exists for the sace of the `sourceType: 'unambiguous'` line
// @see: https://github.com/storybookjs/storybook/issues/5298#issuecomment-545625128
module.exports = {
  presets: ['@babel/preset-env', '@babel/react'],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-dynamic-import',
  ],
  sourceType: 'unambiguous',
};
