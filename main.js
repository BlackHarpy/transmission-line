const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const server = require('./src/server/server')

let mainWindow

function createWindow() {
  
  const port = process.env.PORT || 3000
  mainWindow = new BrowserWindow({width: 1100, height: 900, useContentSize: true})
  mainWindow.on('closed', function () {
    mainWindow = null
  })
    server.listen(port, (err) => {
        if (err) {
            return console.log(err)
        }
        console.log(`server is listening on ${port}`)
        mainWindow.loadURL('http://localhost:3000')        
    })

}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
