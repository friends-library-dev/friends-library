const { ipcRenderer } = require('electron');
const logger = require('./lib/log');
const { updateRepo } = require('./lib/git');

ipcRenderer.on('update:repo', (_, repoPath) => {
  logger.log('bg-worker update:repo');
  updateRepo(repoPath);
});
