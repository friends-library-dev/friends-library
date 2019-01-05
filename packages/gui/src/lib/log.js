const isDev = require('electron-is-dev');

module.exports = isDev ? require('electron-timber') : {
  error: () => {},
  log: () => {},
  warn: () => {},
};
