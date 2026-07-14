console.log('running...')

const { app, BrowserWindow } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 592,
        height: 666,
        resizable: false,
        maximizable: false,
        frame: true,
        fullscreenable: false,
        transparent: false,
        webPreferences: {
            contextIsolation: true
        }
    });
    win.setMenu(null);
    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow()  
})