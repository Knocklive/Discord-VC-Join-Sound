const Store = require("electron-store")

const store = new Store()

module.exports = {
  getToken: () => store.get("discordToken"),
  setToken: (token) => store.set("discordToken", token),
  getChannelId: () => store.get("channelId"),
  setChannelId: (channelId) => store.set("channelId", channelId),
  getAutoMoveEnabled: () => store.get("autoMoveEnabled"),
  setAutoMoveEnabled: (enabled) => store.set("autoMoveEnabled", enabled),
  getHotkey: () => store.get("hotkey"),
  setHotkey: (hotkey) => store.set("hotkey", hotkey),
}