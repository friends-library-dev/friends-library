const { safeLoad } = require('js-yaml');
const { ipcRenderer } = require('electron');
const logger = require('electron-timber');
const { updateRepo } = require('./lib/git');

ipcRenderer.on('friend:get', (_, slug) => {
  const baseUrl = 'https://raw.githubusercontent.com/friends-library/friends-library/master/packages/friends/yml';
  const url = `${baseUrl}/${slug}.yml`;
  fetch(url)
    .then(res => res.text())
    .then(yml => safeLoad(yml))
    .then(json => ipcRenderer.send('receive:friend', json, 'en'));
});

ipcRenderer.on('update:repo', (_, repoPath) => {
  logger.log(`update:repo ${repoPath}`);
  updateRepo(repoPath);
});
