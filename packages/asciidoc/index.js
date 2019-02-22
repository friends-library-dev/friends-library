require('@babel/register');
const lint = require('./src/lint').default;
const { quotify, quotifyLine } = require('./src/quotify');

module.exports = {
  lint,
  quotify,
  quotifyLine,
};
