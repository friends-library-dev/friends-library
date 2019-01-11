const Store = require('electron-store');

const storage = new Store({
  defaults: {
    state: {
      tasks: {},
      prefs: {},
    },
  },
});

module.exports = storage;
