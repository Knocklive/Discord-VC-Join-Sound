const { app, BrowserWindow, ipcMain } = require('electron');
const config = require('./config');
const { startBot } = require('./bot');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 370,
    height: 550,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

function sendStatus(status) {
  if (mainWindow) {
    mainWindow.webContents.send('bot-status', status);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('save-config', (event, { token, channelId }) => {
  config.setToken(token);
  config.setChannelId(channelId);
  startBot(sendStatus);
});

ipcMain.on('get-config', (event) => {
  event.reply('config', {
    token: config.getToken(),
    channelId: config.getChannelId()
  });
});

app.on('ready', () => {
  if (config.getToken() && config.getChannelId()) {
    startBot(sendStatus);
  }
});