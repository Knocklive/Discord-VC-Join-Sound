const Store = require("electron-store")
const path = require("path")
const fs = require("fs")

const store = new Store()

// Helper function to get default sound path
function getDefaultSoundPath() {
  try {
    const resourcesPath = process.resourcesPath || __dirname
    return path.join(resourcesPath, "sound.mp3")
  } catch (error) {
    console.error("Error getting default sound path:", error)
    return null
  }
}

module.exports = {
  getToken: () => store.get("discordToken"),
  setToken: (token) => store.set("discordToken", token),

  getChannelIds: () => store.get("channelIds") || [],
  setChannelIds: (channelIds) => store.set("channelIds", channelIds),

  getAutoMoveEnabled: () => store.get("autoMoveEnabled"),
  setAutoMoveEnabled: (enabled) => store.set("autoMoveEnabled", enabled),

  getHotkey: () => store.get("hotkey"),
  setHotkey: (hotkey) => store.set("hotkey", hotkey),

  // Sound settings
  getSoundEnabled: () => store.get("soundEnabled", true),
  setSoundEnabled: (enabled) => store.set("soundEnabled", enabled),

  getSoundVolume: () => store.get("soundVolume", 0.5),
  setSoundVolume: (volume) => store.set("soundVolume", volume),

  getCustomSoundPath: () => {
    const savedPath = store.get("customSoundPath")
    if (savedPath && fs.existsSync(savedPath)) {
      return savedPath
    }
    return null
  },
  setCustomSoundPath: (path) => store.set("customSoundPath", path),

  // Nickname lists
  getBlacklistedNicknames: () => store.get("blacklistedNicknames") || [],
  setBlacklistedNicknames: (nicknames) => store.set("blacklistedNicknames", nicknames),

  getWhitelistedNicknames: () => store.get("whitelistedNicknames") || [],
  setWhitelistedNicknames: (nicknames) => store.set("whitelistedNicknames", nicknames),

  getUseWhitelist: () => store.get("useWhitelist", false),
  setUseWhitelist: (useWhitelist) => store.set("useWhitelist", useWhitelist),

  // Auto move lists
  getAutoMoveBlacklistedNicknames: () => store.get("autoMoveBlacklistedNicknames") || [],
  setAutoMoveBlacklistedNicknames: (nicknames) => store.set("autoMoveBlacklistedNicknames", nicknames),

  getAutoMoveWhitelistedNicknames: () => store.get("autoMoveWhitelistedNicknames") || [],
  setAutoMoveWhitelistedNicknames: (nicknames) => store.set("autoMoveWhitelistedNicknames", nicknames),

  getAutoMoveUseWhitelist: () => store.get("autoMoveUseWhitelist", false),
  setAutoMoveUseWhitelist: (useWhitelist) => store.set("autoMoveUseWhitelist", useWhitelist),

  getIgnoreBots: () => store.get("ignoreBots", true),
  setIgnoreBots: (ignore) => store.set("ignoreBots", ignore),

  getAutoMoveIgnoreBots: () => store.get("autoMoveIgnoreBots", true),
  setAutoMoveIgnoreBots: (ignore) => store.set("autoMoveIgnoreBots", ignore),

  getDefaultSoundPath,
}