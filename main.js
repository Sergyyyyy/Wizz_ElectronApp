const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 592,
        height: 666
    })
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow()
})