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
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./src/index');
