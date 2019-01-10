const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron');
const { answerRenderer, callRenderer } = require('electron-better-ipc');
const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
} = require('electron-devtools-installer');
const devTron = require('devtron');
const debug = require('electron-debug');
const path = require('path');
const fixPath = require('fix-path');
const url = require('url');
const fs = require('fs-extra');
const isDev = require('electron-is-dev');
const { execSync } = require('child_process');
const logger = require('../src/lib/log');
const { PATH_EN } = require('../src/lib/path');
const storage = require('../src/lib/storage');
const { watchForAutoUpdates } = require('../src/lib/auto-update');

// ensure we use the full $PATH from the shell when packaged
fixPath();

debug({
  enabled: true, // always enable, even in production
  showDevTools: isDev,
  devToolsMode: 'bottom',
});

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

if (!isDev) {
  watchForAutoUpdates();
}

let mainWindow;
let workerWindow;
let bgWorkerWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: '#282c34',
    x: 0,
    y: 0,
    width: 1211,
    height: 10000, // max height
  });

  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true,
  });
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createWorkerWindow() {
  workerWindow = new BrowserWindow({ show: false });
  workerWindow.loadFile('src/worker.html');
}

function createBgWorkerWindow() {
  bgWorkerWindow = new BrowserWindow({ show: false });
  bgWorkerWindow.loadFile('src/bg-worker.html');
}

app.on('ready', createMainWindow);
app.on('ready', createWorkerWindow);
app.on('ready', createBgWorkerWindow);

app.on('ready', () => {
  devTron.install();
  installExtension(REACT_DEVELOPER_TOOLS);
  installExtension(REDUX_DEVTOOLS);
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

ipcMain.on('request:files', (_, friendSlug) => {
  workerWindow.webContents.send('request:files', friendSlug);
});

ipcMain.on('receive:files', (_, friendSlug, files) => {
  if (mainWindow) {
    mainWindow.webContents.send('RECEIVE_REPO_FILES', friendSlug, files);
  }
});


ipcMain.on('request:filecontent', (_, filepath) => {
  workerWindow.webContents.send('request:filecontent', filepath);
});

ipcMain.on('receive:filecontent', (_, filepath, content) => {
  const [
    filename,
    editionType,
    documentSlug,
    friendSlug,
    lang,
  ] = filepath.split('/').reverse();

  mainWindow.webContents.send('DISPATCH', 'UPDATE_FILE_CONTENT', {
    filename,
    editionType,
    documentSlug,
    friendSlug,
    lang,
    diskContent: content,
    editedContent: content,
  });
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
      bgWorkerWindow.webContents.send('update:repo', repo);
    });
  }
});

ipcMain.on('save:files', (_, files) => {
  files.forEach(({ path: filepath, editedContent }) => {
    fs.writeFile(filepath, editedContent);
  });
});

ipcMain.on('commit:wip', (_, friendSlug) => {
  logger.log('main commit:wip', friendSlug);
  workerWindow.webContents.send('commit:wip', friendSlug);
});

ipcMain.on('error', (_, msg) => dialog.showErrorBox(msg, ''));

answerRenderer('ensure:branch', async task => {
  const branch = await callRenderer(workerWindow, 'ensure:branch', task);
  return branch;
});

answerRenderer('git:push', async task => {
  await callRenderer(workerWindow, 'git:push', task);
  return 'pushed';
});

answerRenderer('stored-state:get', () => {
  return Promise.resolve(storage.get('state'));
});

ipcMain.on('storage:update-state', (_, { tasks }) => {
  storage.set('state.tasks', tasks);
});

ipcMain.on('reset:storage', () => storage.set('state', {}));

ipcMain.on('open:url', (_, uri) => shell.openExternal(uri));

ipcMain.on('delete:task-branch', (_, task) => {
  workerWindow.webContents.send('delete:task-branch', task);
});
