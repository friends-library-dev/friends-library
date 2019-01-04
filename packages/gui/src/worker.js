const { safeLoad } = require('js-yaml');
const { sync: glob } = require('glob');
const fs = require('fs');
const { ipcRenderer } = require('electron');
const { answerMain } = require('electron-better-ipc');
const logger = require('./lib/log');
const { updateRepo, ensureBranch, commitWip, pushTask } = require('./lib/git');
const { PATH_EN } = require('./lib/path');

ipcRenderer.on('friend:get', (_, slug) => {
  const baseUrl = 'https://raw.githubusercontent.com/friends-library/friends-library/master/packages/friends/yml';
  const url = `${baseUrl}/${slug}.yml`;
  fetch(url)
    .then(res => res.text())
    .then(yml => safeLoad(yml))
    .then(json => ipcRenderer.send('receive:friend', json, 'en'));
});

ipcRenderer.on('update:repo', (_, repoPath) => {
  updateRepo(repoPath);
});

ipcRenderer.on('request:files', (_, friendSlug) => {
  const files = glob(`${PATH_EN}/${friendSlug}/**/*.adoc`)
    .map(file => ({
      fullPath: file,
      relPath: file.replace(`${PATH_EN}/${friendSlug}/`, ''),
    }));
  ipcRenderer.send('receive:files', friendSlug, files);
});

ipcRenderer.on('request:filecontent', (_, path) => {
  const content = fs.readFileSync(path).toString();
  ipcRenderer.send('receive:filecontent', path, content);
});

answerMain('ensure:branch', task => {
  return Promise.resolve(ensureBranch(task));
});

answerMain('git:push', task => {
  return Promise.resolve(pushTask(task));
});

ipcRenderer.on('commit:wip', (_, friendSlug) => {
  logger.log('worker, commit:wip', friendSlug);
  commitWip(friendSlug);
});
