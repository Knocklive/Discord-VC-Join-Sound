const { Client } = require("discord.js-selfbot-v13")
const config = require("./config")
const { playSound } = require("./audio")

let client

async function triggerRandomMove() {
  console.log("Auto-move triggered")

  if (!client || !client.user) {
    console.log("Client not ready")
    return
  }

  const sourceChannelId = config.getChannelId()

  try {
    const sourceChannel = await client.channels.fetch(sourceChannelId)

    if (!sourceChannel || !sourceChannel.members) {
      console.log("Source channel not found or invalid")
      return
    }

    const guild = sourceChannel.guild
    const botMember = await guild.members.fetch(client.user.id)

    if (!botMember?.voice?.channel) {
      console.log("Bot is not in a voice channel")
      return
    }

    const targetChannelId = botMember.voice.channel.id

    if (targetChannelId === sourceChannelId) {
      console.log("Bot is in the source channel")
      return
    }

    const members = Array.from(sourceChannel.members.values())

    if (members.length === 0) {
      console.log("No members in source channel")
      return
    }

    const randomMember = members[Math.floor(Math.random() * members.length)]

    console.log(`Attempting to move ${randomMember.user.username} to channel ${targetChannelId}`)
    await randomMember.voice.setChannel(targetChannelId)
    console.log(`Successfully moved ${randomMember.user.username}`)
  } catch (error) {
    console.error("Failed to move member:", error)
  }
}

function startBot(sendStatus) {
  if (typeof sendStatus !== "function") {
    sendStatus = (message) => console.log(message)
  }

  if (client) {
    client.destroy()
  }

  client = new Client()

  client.once("ready", () => {
    console.log("Bot is ready!")
    sendStatus("Bot is ready and watching the Voice-Channel")
  })

  client.on("voiceStateUpdate", (oldState, newState) => {
    const channelId = config.getChannelId()
    if (newState.channelId === channelId && oldState.channelId !== channelId) {
      const user = newState.member.user
      console.log(`${user.username} joined the channel`)
      sendStatus(`${user.username} joined the Channel. Playing Sound.`)
      playSound(sendStatus)
    }
  })

  client.login(config.getToken()).catch((error) => {
    console.error("Failed to login:", error)
    sendStatus(`Failed to login: ${error.message}`)
  })
}

module.exports = { startBot, triggerRandomMove }