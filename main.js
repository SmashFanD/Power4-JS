import { BrowserWindow, app, Menu, session } from 'electron';

function createWindow () {
  const win = new BrowserWindow({ 
    width: 1200, 
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  console.log("browser setup")
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {
      label: 'Options',
      submenu: [
        {
          label: 'Full Screen',
          accelerator: 'Escape',
          click: () => win.setFullScreen(!win.isFullScreen())
        },
        {
          label: 'Dev Tools',
          accelerator: 'F12',
          click: () => win.webContents.toggleDevTools()
        },
        {
          label: 'Reload Page',
          accelerator: 'F5',
          click: () => win.webContents.reload()
        },
        {
          label: 'ReloadPageClearCache',
          accelerator: 'F6',
          click: () => {
            session.defaultSession.clearCache().then(() => {
              win.webContents.reload()
            });
          }
        }
      ]
    }
  ]))
  
  console.log("app menu setup")
  win.loadFile('index.html')
  console.log("index.html is loading")
}
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.whenReady().then(createWindow);
console.log("waiting app to be ready")