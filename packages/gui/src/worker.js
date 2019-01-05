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
  logger.log('worker update:repo');
  updateRepo(repoPath);
});

ipcRenderer.on('request:files', (_, friendSlug) => {
  logger.log('worker request:files');
  const files = glob(`${PATH_EN}/${friendSlug}/**/*.adoc`)
    .map(file => ({
      fullPath: file,
      relPath: file.replace(`${PATH_EN}/${friendSlug}/`, ''),
    }));
  ipcRenderer.send('receive:files', friendSlug, files);
});

ipcRenderer.on('request:filecontent', (_, path) => {
  logger.log('worker request:filecontent');
  const content = fs.readFileSync(path).toString();
  ipcRenderer.send('receive:filecontent', path, content);
});

answerMain('ensure:branch', task => {
  logger.log('worker ensure:branch');
  return Promise.resolve(ensureBranch(task));
});

answerMain('git:push', task => {
  logger.log('worker git:push');
  return Promise.resolve(pushTask(task));
});

ipcRenderer.on('commit:wip', (_, friendSlug) => {
  logger.log('worker, commit:wip', friendSlug);
  commitWip(friendSlug);
});
