// @flow
const electron = window.require('electron');
const betterIpc = window.require('electron-better-ipc');

module.exports = {
  ipcRenderer: electron.ipcRenderer,
  ipcMain: electron.ipcMain,
  callMain: betterIpc.callMain,
  answerRenderer: betterIpc.answerRenderer,
};
