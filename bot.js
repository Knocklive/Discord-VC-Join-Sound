const { Client } = require('discord.js-selfbot-v13');
const config = require('./config');
const { playSound } = require('./audio');

let client;

function startBot(sendStatus) {
  if (typeof sendStatus !== 'function') {
    sendStatus = (message) => console.log(message);
  }

  if (client) {
    client.destroy();
  }

  client = new Client();

  client.once('ready', () => {
    console.log('Bot is ready!');
    sendStatus('Bot is ready and watching the Voice-Channel');
  });

  client.on('voiceStateUpdate', (oldState, newState) => {
    const channelId = config.getChannelId();
    if (newState.channelId === channelId && oldState.channelId !== channelId) {
      const user = newState.member.user;
      console.log(`${user.username} joined the channel`);
      sendStatus(`${user.username} joined the Channel. Playing Sound.`);
      playSound(sendStatus);
    }
  });

  client.login(config.getToken()).catch(error => {
    console.error('Failed to login:', error);
    sendStatus(`Failed to login: ${error.message}`);
  });
}

module.exports = { startBot };