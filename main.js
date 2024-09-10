const { app, BaseWindow, WebContentsView, autoUpdater } = require('electron');
const path = require('path');
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')

if(require('electron-squirrel-startup')) app.quit();

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
        alwaysOnTop: true,
    })
    mainWindow.setMenuBarVisibility(false);
    mainWindow.setAutoHideMenuBar(false);

    const server = 'https://update.electronjs.org'
    const feed = {url: `${server}/OWNER/REPO/${process.platform}-${process.arch}/${app.getVersion()}`}
    autoUpdater.setFeedURL(feed)

    setInterval(() => {
        autoUpdater.checkForUpdates()
    }, 10 * 60 * 1000)

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
    updateElectronApp({
        updateSource: {
            type: UpdateSourceType.StaticStorage,
            baseUrl: `https://my-bucket.s3.amazonaws.com/my-app-updates/${process.platform}/${process.arch}`
        },
        updateInterval: '1 hour',
    })
    createWindow();
    app.on('activate', function () {
        if (BaseWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

module.exports = createWindow;