const { app, BrowserWindow, ipcMain, globalShortcut, dialog } = require("electron")
const config = require("./config")
const { startBot, triggerRandomMove } = require("./bot")
const { setMainWindow, setupAudioHandlers } = require("./audio")
const path = require("path")
const fs = require("fs")

global.mainWindow = null;

let mainWindow
let currentHotkey = ""

const acceleratorMapping = {
  Num0: "numadd",
  Num1: "num1",
  Num2: "num2",
  Num3: "num3",
  Num4: "num4",
  Num5: "num5",
  Num6: "num6",
  Num7: "num7",
  Num8: "num8",
  Num9: "num9",
  NumPlus: "numadd",
  NumMinus: "numsub",
  NumMultiply: "nummult",
  NumDivide: "numdiv",
  NumDecimal: "numdec",
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 990,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile("index.html")
  setMainWindow(mainWindow)
  global.mainWindow = mainWindow;
}

function registerHotkey(hotkey) {
  if (!hotkey) return

  try {
    if (currentHotkey) {
      globalShortcut.unregister(currentHotkey)
    }

    const accelerator = hotkey
      .split("+")
      .map((key) => {
        if (["Control", "Alt", "Shift", "Meta"].includes(key)) {
          return key === "Meta" ? "Super" : key === "Control" ? "CommandOrControl" : key
        }
        return acceleratorMapping[key] || key
      })
      .join("+")

    console.log("Attempting to register hotkey:", accelerator)

    const success = globalShortcut.register(accelerator, () => {
      console.log("Hotkey pressed! Triggering move directly...")
      triggerRandomMove()
    })

    if (success) {
      currentHotkey = accelerator
      console.log("Hotkey registered successfully:", accelerator)
    } else {
      console.error("Failed to register hotkey:", accelerator)
    }
  } catch (error) {
    console.error("Error registering hotkey:", error)
  }
}

function sendStatus(status) {
  if (mainWindow) {
    mainWindow.webContents.send("bot-status", status)
  }
}

// Copy the default sound file to resources if it doesn't exist
function ensureDefaultSoundExists() {
  try {
    const resourcesPath = process.resourcesPath || __dirname
    const soundFilePath = path.join(resourcesPath, "sound.mp3")

    // Check if sound.mp3 exists in resources
    if (!fs.existsSync(soundFilePath)) {
      // Copy from the app directory
      const sourcePath = path.join(__dirname, "sound.mp3")
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, soundFilePath)
        console.log("Default sound file copied to resources")
      } else {
        console.error("Default sound file not found in app directory")
      }
    }
  } catch (error) {
    console.error("Error ensuring default sound exists:", error)
  }
}

app.whenReady().then(() => {
  ensureDefaultSoundExists()
  createWindow()
  setupAudioHandlers()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on(
  "save-config",
  (
    event,
    {
      token,
      channelIds,
      autoMoveEnabled,
      hotkey,
      blacklistedNicknames,
      whitelistedNicknames,
      useWhitelist,
      autoMoveBlacklistedNicknames,
      autoMoveWhitelistedNicknames,
      autoMoveUseWhitelist,
      ignoreBots,
      autoMoveIgnoreBots,
    },
  ) => {
    console.log("Saving config with hotkey:", hotkey)

    config.setToken(token)
    config.setChannelIds(channelIds)
    config.setAutoMoveEnabled(autoMoveEnabled)
    config.setHotkey(hotkey)
    config.setBlacklistedNicknames(blacklistedNicknames || [])
    config.setWhitelistedNicknames(whitelistedNicknames || [])
    config.setUseWhitelist(useWhitelist)
    config.setAutoMoveBlacklistedNicknames(autoMoveBlacklistedNicknames || [])
    config.setAutoMoveWhitelistedNicknames(autoMoveWhitelistedNicknames || [])
    config.setAutoMoveUseWhitelist(autoMoveUseWhitelist)
    config.setIgnoreBots(ignoreBots)
    config.setAutoMoveIgnoreBots(autoMoveIgnoreBots)

    if (autoMoveEnabled && hotkey) {
      registerHotkey(hotkey)
    } else {
      if (currentHotkey) {
        globalShortcut.unregister(currentHotkey)
        currentHotkey = ""
      }
    }

    startBot(sendStatus)
  },
)

ipcMain.on("get-config", (event) => {
  event.reply("config", {
    token: config.getToken(),
    channelIds: config.getChannelIds(),
    autoMoveEnabled: config.getAutoMoveEnabled(),
    hotkey: config.getHotkey(),
    blacklistedNicknames: config.getBlacklistedNicknames() || [],
    whitelistedNicknames: config.getWhitelistedNicknames() || [],
    useWhitelist: config.getUseWhitelist(),
    autoMoveBlacklistedNicknames: config.getAutoMoveBlacklistedNicknames() || [],
    autoMoveWhitelistedNicknames: config.getAutoMoveWhitelistedNicknames() || [],
    autoMoveUseWhitelist: config.getAutoMoveUseWhitelist(),
    ignoreBots: config.getIgnoreBots(),
    autoMoveIgnoreBots: config.getAutoMoveIgnoreBots(),
  })
})

ipcMain.handle("select-sound-file", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [{ name: "Audio Files", extensions: ["mp3", "wav"] }],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

app.on("ready", () => {
  const savedHotkey = config.getHotkey()
  const autoMoveEnabled = config.getAutoMoveEnabled()

  if (savedHotkey && autoMoveEnabled) {
    registerHotkey(savedHotkey)
  }

  if (config.getToken() && config.getChannelIds().length > 0) {
    startBot(sendStatus)
  }
})

ipcMain.handle('get-move-history', () => {
  const { getMoveHistory } = require('./bot');
  return getMoveHistory();
});

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll()
  if (process.platform !== "darwin") app.quit()
})

app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})