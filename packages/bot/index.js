require('@babel/register')({
  ignore: [
    filepath => {
      if (filepath.match(/packages\/friends\/src\/index\.js$/)) {
        return false;
      }
      return filepath.match(/node_modules/);
    },
  ],
});
module.exports = require('./src/app').default;
