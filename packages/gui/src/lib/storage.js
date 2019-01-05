const Store = require('electron-store');

const storage = new Store({
  defaults: {
    state: {
      tasks: {},
    },
  },
});

module.exports = storage;
