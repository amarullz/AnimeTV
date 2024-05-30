'use strict'

const fs = require('fs-plus')
const path = require('path')
const child = require('child_process')
const pkg = require('../../../package.json')

const appFolder = path.resolve(process.execPath, '..')
const rootFolder = path.resolve(appFolder, '..')
const updateDotExe = path.join(rootFolder, 'Update.exe')
const exeName = path.basename(process.execPath)

function spawn (command, args, callback) {
  let spawnedProcess = null
  let error = null
  let stdout = ''

  try {
    spawnedProcess = child.spawn(command, args)
  } catch (processError) {
    process.nextTick(() => {
      callback(processError, stdout)
    })
    return
  }

  spawnedProcess.stdout.on('data', (data) => {
    stdout += data
  })

  spawnedProcess.on('error', (processError) => {
    error = error || processError
  })

  spawnedProcess.on('close', (code, signal) => {
    if (code !== 0) {
      error = error || new Error(`Command failed: ${(signal || code)}`)
    }

    callback(error, stdout)
  })
}

function spawnUpdate (args, callback) {
  spawn(updateDotExe, args, callback)
}

function createShortcuts (callback) {
  spawnUpdate(['--createShortcut', exeName], callback)
}

function updateShortcuts (callback) {
  const homeDirectory = fs.getHomeDirectory()
  if (homeDirectory) {
    const desktopShortcutPath = path.join(homeDirectory, 'Desktop', `${pkg.name}.lnk`)
    fs.access(desktopShortcutPath, (desktopShortcutExists) => {
      createShortcuts(() => {
        if (desktopShortcutExists) {
          callback()
        } else {
          fs.unlink(desktopShortcutPath, callback)
        }
      })
    })
  } else {
    createShortcuts(callback)
  }
}

function removeShortcuts (callback) {
  spawnUpdate(['--removeShortcut', exeName], callback)
}

const handleCommand = (app, cmd) => {
  switch (cmd) {
    case 'install':
      createShortcuts(() => {
        app.quit()
      })
      return true
    case 'updated':
      updateShortcuts(() => {
        app.quit()
      })
      return true
    case 'uninstall':
      removeShortcuts(() => {
        app.quit()
      })
      return true
    case 'obsolete':
      app.quit()
      return true
    default:
      return false
  }
}

module.exports = {
  spawnUpdate: spawnUpdate,
  handleCommand: handleCommand
}