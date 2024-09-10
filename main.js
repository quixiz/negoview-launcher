const { app, BaseWindow, WebContentsView, autoUpdater } = require('electron');
const path = require('path');
const { version } = require("./package");
const log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file = __dirname + 'log.log';

if(require('electron-squirrel-startup')) return;

log.info(`Current version: ${version}`);

const server = 'https://update.electronjs.org'
const feed = {url: `${server}/MaximeQuixiz/negoview-launcher/${app.getVersion()}`}
autoUpdater.setFeedURL(feed);
autoUpdater.checkForUpdates();

autoUpdater.on("checking-for-update", () => {
    log.info('checking-for-update');
});

autoUpdater.on("update-available", () => {
    log.info("update-available");
});

autoUpdater.on("update-not-available", () => {
    log.info("update-not-available");
});

autoUpdater.on("error", (error) => {
    log.info("error", { error });
});

function createWindow() {
    const mainWindow = new BaseWindow({
        width: 1200,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: false,
            nodeIntegration: false,
            contextIsolation: true,
        },
        show: false,
        alwaysOnTop: false,
    })
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(false);

    const webView = new WebContentsView();
    webView.webContents.loadURL('https://dev.negoview.com/provera5Mx/');
    mainWindow.contentView.addChildView(webView);
    webView.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    mainWindow.on('resize', () => {
        webView.setBounds({ x: 0, y: 0, width: mainWindow.getContentSize()[0], height: mainWindow.getContentSize()[1]});
    });

    const loadingView = new WebContentsView();
    loadingView.webContents.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.contentView.addChildView(loadingView);
    loadingView.setBounds({ x: 0, y: 0, width: mainWindow.getContentSize()[0], height: mainWindow.getContentSize()[1]});

    mainWindow.show();

    webView.webContents.on('did-stop-loading', () => {
        mainWindow.contentView.removeChildView(loadingView);
        webView.setBounds({ x: 0, y: 0, width: mainWindow.getContentSize()[0], height: mainWindow.getContentSize()[1]});
    });
}

// Electron app lifecycle hooks
app.whenReady().then(() => {
    createWindow();
    app.on('activate', function () {
        if (BaseWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

module.exports = createWindow;