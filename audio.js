const { ipcMain } = require("electron")
const config = require("./config")

let mainWindow
let audioEnabled = true
let volume = 0.5
let customSoundPath = null

function setMainWindow(window) {
  mainWindow = window

  // Initialize audio settings from config
  audioEnabled = config.getSoundEnabled()
  volume = config.getSoundVolume()
  customSoundPath = config.getCustomSoundPath()
}

function playSound() {
  if (!audioEnabled || !mainWindow) return

  // Tell the renderer process to play the sound
  mainWindow.webContents.send("play-sound", {
    volume: volume,
    customSoundPath: customSoundPath,
  })
}

function setupAudioHandlers() {
  ipcMain.on("set-audio-enabled", (_, enabled) => {
    audioEnabled = enabled
    config.setSoundEnabled(enabled)
  })

  ipcMain.on("set-volume", (_, newVolume) => {
    volume = newVolume
    config.setSoundVolume(newVolume)
  })

  ipcMain.on("set-custom-sound", (_, soundPath) => {
    customSoundPath = soundPath
    config.setCustomSoundPath(soundPath)
  })

  ipcMain.on("reset-to-default-sound", () => {
    customSoundPath = null
    config.setCustomSoundPath(null)
    if (mainWindow) {
      mainWindow.webContents.send("sound-reset")
    }
  })

  ipcMain.handle("get-audio-settings", () => {
    return {
      enabled: audioEnabled,
      volume: volume,
      customSoundPath: customSoundPath,
      defaultSoundPath: config.getDefaultSoundPath(),
    }
  })
}

module.exports = {
  playSound,
  setMainWindow,
  setupAudioHandlers,
}