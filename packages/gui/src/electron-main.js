// @flow
const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');
const logger = require('electron-timber');
const isDev = require('electron-is-dev');
const { execSync } = require('child_process');
const { PATH_EN } = require('./lib/path');

try {
  execSync('git --version');
} catch (e) {
  logger.error('git not installed');
  dialog.showErrorBox('Error: git is not installed.', '');
  app.quit();
}

if (!fs.existsSync(PATH_EN)) {
  logger.error('bad repo path');
  dialog.showErrorBox('Error: doc repo path must be ~/fl/{en,es}/', '');
  app.quit();
}

let mainWindow;
let workerWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: '#282c34',
    width: 1600,
    height: 800,
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  mainWindow.loadURL(startUrl);

  if (isDev) {
    BrowserWindow.addDevToolsExtension('/Users/jared/Library/Application Support/Google/Chrome/Default/Extensions/lmhkpmbekcpmknklioeibfkpmmfibljd/2.17.0_0');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createWorkerWindow() {
  workerWindow = new BrowserWindow({ show: false });
  workerWindow.loadFile('src/worker.html');
  workerWindow.webContents.openDevTools();
}

app.on('ready', createWorkerWindow);
app.on('ready', createMainWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow()
  }
});

ipcMain.on('receive:friend', (_, friend, lang) => {
  if (mainWindow) {
    mainWindow.webContents.send('RECEIVE_FRIEND', friend, lang);
  }
});

ipcMain.on('receive:repos', (_, repos) => {
  repos.forEach(repo => {
    const slug = `en/${repo.name}`;
    workerWindow.webContents.send('friend:get', slug);
  });

  if (!isDev) {
    repos.forEach(repo => {
      const repoPath = `${PATH_EN}/${repo.name}`;
      workerWindow.webContents.send('update:repo', repoPath);
    });
  }
});
