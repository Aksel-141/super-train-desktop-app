import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// @ts-ignore
import icon from '../../resources/icon.png?asset'

import ExerciseService from './ExerciseService/index'
import BaseDataService from './BaseDataService'

/**
 * @type {BrowserWindow | null}
 */
let mainWindow = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle('add-exercise', async (_, exercise) => {
    ExerciseService.addExercise(exercise)
    return ExerciseService.getExercises()
  })
  ipcMain.handle('update-exercise', async (_, exercise) => {
    ExerciseService.updateExercise(exercise)
    return ExerciseService.getExercises()
  })

  ipcMain.handle('get-exercises', async () => {
    return ExerciseService.getExercises()
  })
  ipcMain.handle('remove-exercise', async (_, id) => {
    return ExerciseService.removeExercise(id)
  })

  //Отримання базових даних про групи м'язів для створення вправ
  ipcMain.handle('get-MuscleGroup', async () => {
    return BaseDataService.getMuscleGroups()
  })
  //Отримання базових даних про обладнання для створення вправ
  ipcMain.handle('get-EquipmentsList', async () => {
    return BaseDataService.getEquipmentsList()
  })
  //Отримання базових вправ про тип вправи для створення вправ
  ipcMain.handle('get-ExerciseTypes', async () => {
    return BaseDataService.getExerciseTypes()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
