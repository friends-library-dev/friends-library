require('@babel/register');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const cloud = require('./src/cloud');

module.exports = {
  cloud,
};
