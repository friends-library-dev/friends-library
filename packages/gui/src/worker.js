const { ipcRenderer } = require('electron');
const logger = require('electron-timber');
const { updateRepo } = require('./lib/git');

ipcRenderer.on('update:repo', (_, repoPath) => {
  logger.log(`update:repo ${repoPath}`);
  updateRepo(repoPath);
});
