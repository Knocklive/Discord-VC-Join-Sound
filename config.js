const Store = require('electron-store');

const store = new Store();

module.exports = {
  getToken: () => store.get('discordToken'),
  setToken: (token) => store.set('discordToken', token),
  getChannelId: () => store.get('channelId'),
  setChannelId: (channelId) => store.set('channelId', channelId)
};