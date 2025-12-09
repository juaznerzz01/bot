const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    // janela simples, sem menu nem barra de navegação
     icon: path.join(__dirname, 'build', 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,      // segurança: sem Node dentro da página
      contextIsolation: true,      // isola contextos
    }
  });

  // Abre diretamente a Quotex
  win.loadURL('https://quotex.com/');

  // Carrega seu script de um arquivo local
  const scriptPath = path.join(__dirname, 'inject.js');
  let customScript = '';

  if (fs.existsSync(scriptPath)) {
    customScript = fs.readFileSync(scriptPath, 'utf8');
  }

  // Assim que a página terminar de carregar, executa o script
  win.webContents.on('did-finish-load', () => {
    if (customScript) {
      win.webContents.executeJavaScript(customScript)
        .then(() => {
          console.log('Script injetado com sucesso.');
        })
        .catch(err => {
          console.error('Erro ao injetar script:', err);
        });
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
