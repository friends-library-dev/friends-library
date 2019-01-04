const { autoUpdater, dialog } = require('electron');
const isDev = require('electron-is-dev');

const endpoint = isDev ? 'http://localhost:1111' : 'https://api.friendslibrary.com';

function watchForAutoUpdates() {
  let checking = false;

  autoUpdater.setFeedURL(`${endpoint}/gui/update`);

  setInterval(() => {
    if (!checking) {
      checking = true;
      autoUpdater.checkForUpdates()
    }
  }, 20000);

  autoUpdater.on('update-not-available', () => checking = false);

  autoUpdater.on('update-downloaded', () => {
    checking = false;
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: 'New version!',
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  });
}

module.exports = {
  watchForAutoUpdates,
};
