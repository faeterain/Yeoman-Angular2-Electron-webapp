'use strict';
const { app, BrowserWindow } = require('electron');
/** 
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 */
var mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    /**
     * On macOS it is common for applications and their menu bar
     * to stay active until the user quits explicitly with Cmd + Q
     */
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

/**
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on('ready', function() {

    // Create the browser window and load the index.html of the app.
    mainWindow = new BrowserWindow({ width: 1200, height: 750 });
    mainWindow.loadURL('file://' + __dirname + '/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.1
    mainWindow.on('closed', function() {
        mainWindow = null;
    });
});