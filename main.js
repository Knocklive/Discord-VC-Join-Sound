const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron")
const config = require("./config")
const { startBot, triggerRandomMove } = require("./bot")

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
    width: 370,
    height: 700,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadFile("index.html")
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

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  globalShortcut.unregisterAll()
  if (process.platform !== "darwin") app.quit()
})

ipcMain.on("save-config", (event, { token, channelId, autoMoveEnabled, hotkey }) => {
  console.log("Saving config with hotkey:", hotkey)

  config.setToken(token)
  config.setChannelId(channelId)
  config.setAutoMoveEnabled(autoMoveEnabled)
  config.setHotkey(hotkey)

  if (autoMoveEnabled && hotkey) {
    registerHotkey(hotkey)
  } else {
    if (currentHotkey) {
      globalShortcut.unregister(currentHotkey)
      currentHotkey = ""
    }
  }

  startBot(sendStatus)
})

ipcMain.on("get-config", (event) => {
  event.reply("config", {
    token: config.getToken(),
    channelId: config.getChannelId(),
    autoMoveEnabled: config.getAutoMoveEnabled(),
    hotkey: config.getHotkey(),
  })
})

app.on("ready", () => {
  const savedHotkey = config.getHotkey()
  const autoMoveEnabled = config.getAutoMoveEnabled()

  if (savedHotkey && autoMoveEnabled) {
    registerHotkey(savedHotkey)
  }

  if (config.getToken() && config.getChannelId()) {
    startBot(sendStatus)
  }
})

app.on("will-quit", () => {
  globalShortcut.unregisterAll()
})