const { Client } = require("discord.js-selfbot-v13")
const config = require("./config")
const { playSound } = require("./audio")

let client
let moveHistory = [];

function addToMoveHistory(user, channelId) {
  const moveEntry = {
    username: user.username,
    displayName: user.displayName || user.username,
    userId: user.id,
    timestamp: new Date().toISOString(),
    channelId: channelId
  };
  
  moveHistory.unshift(moveEntry);
  
  if (moveHistory.length > 50) {
    moveHistory = moveHistory.slice(0, 50);
  }
  
  if (global.mainWindow) {
    global.mainWindow.webContents.send('move-history-updated', moveHistory);
  }
}

// Helper function to check if a user matches a filter list
function userMatchesFilter(user, member, filterList) {
  if (!user || !filterList || !filterList.length) return false

  // Get all possible name variations
  const username = user.username?.toLowerCase() || ""
  const displayName = user.displayName?.toLowerCase() || user.username?.toLowerCase() || ""
  const nickname = member?.nickname?.toLowerCase() || ""

  return filterList.some((filter) => {
    if (!filter) return false
    const filterLower = filter.toLowerCase()
    return username.includes(filterLower) || displayName.includes(filterLower) || nickname.includes(filterLower)
  })
}

// Helper function to check if a user is a bot
function isBot(user) {
  return user && user.bot === true
}

async function triggerRandomMove() {
  console.log("Auto-move triggered")

  if (!client || !client.user) {
    console.log("Client not ready")
    return
  }

  const channelIds = config.getChannelIds()
  if (!channelIds || channelIds.length === 0) {
    console.log("No source channels configured")
    return
  }

  // Randomly select a channel if multiple are configured
  const sourceChannelId = channelIds[Math.floor(Math.random() * channelIds.length)]

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

    // Filter members based on whitelist/blacklist and bot status
    const useWhitelist = config.getAutoMoveUseWhitelist()
    const whitelistedNicknames = config.getAutoMoveWhitelistedNicknames() || []
    const blacklistedNicknames = config.getAutoMoveBlacklistedNicknames() || []
    const ignoreBots = config.getAutoMoveIgnoreBots()

    const filteredMembers = members.filter((member) => {
      const user = member.user

      // Skip bots if ignore bots is enabled
      if (ignoreBots && isBot(user)) {
        console.log(`Skipping bot user: ${user.username}`)
        return false
      }

      if (useWhitelist) {
        // In whitelist mode, only move users in the whitelist
        return userMatchesFilter(user, member, whitelistedNicknames)
      } else {
        // In blacklist mode, don't move users in the blacklist
        return !userMatchesFilter(user, member, blacklistedNicknames)
      }
    })

    if (filteredMembers.length === 0) {
      console.log("No eligible members to move after filtering")
      return
    }

    const randomMember = filteredMembers[Math.floor(Math.random() * filteredMembers.length)]

    console.log(`Attempting to move ${randomMember.user.username} to channel ${targetChannelId}`)
    await randomMember.voice.setChannel(targetChannelId)
    console.log(`Successfully moved ${randomMember.user.username}`)
    addToMoveHistory(randomMember.user, targetChannelId);
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
    sendStatus("Bot is ready and watching the Voice-Channels")
  })

  client.on("voiceStateUpdate", (oldState, newState) => {
    const channelIds = config.getChannelIds()
    if (channelIds.includes(newState.channelId) && !channelIds.includes(oldState.channelId)) {
      const user = newState.member.user
      const member = newState.member
      const username = user.username

      // Check if the user is a bot and if we should ignore bots
      const ignoreBots = config.getIgnoreBots()
      if (ignoreBots && isBot(user)) {
        console.log(`Ignoring bot user: ${username}`)
        sendStatus(`${username} joined the Channel but is a bot. Ignoring.`)
        return
      }

      // Check if the username/nickname is in whitelist/blacklist
      const useWhitelist = config.getUseWhitelist()
      const whitelistedNicknames = config.getWhitelistedNicknames() || []
      const blacklistedNicknames = config.getBlacklistedNicknames() || []

      let shouldPlaySound = false

      if (useWhitelist) {
        // In whitelist mode, only play for users in the whitelist
        shouldPlaySound = userMatchesFilter(user, member, whitelistedNicknames)

        if (!shouldPlaySound) {
          console.log(`${username} is not in whitelist. Ignoring.`)
          sendStatus(`${username} joined the Channel but is not in whitelist. Ignoring.`)
          return
        }
      } else {
        // In blacklist mode, don't play for users in the blacklist
        shouldPlaySound = !userMatchesFilter(user, member, blacklistedNicknames)

        if (!shouldPlaySound) {
          console.log(`${username} is blacklisted. Ignoring.`)
          sendStatus(`${username} joined the Channel but is blacklisted. Ignoring.`)
          return
        }
      }

      console.log(`${username} joined the channel`)
      sendStatus(`${username} joined the Channel. Playing Sound.`)
      playSound()
    }
  })

  client.login(config.getToken()).catch((error) => {
    console.error("Failed to login:", error)
    sendStatus(`Failed to login: ${error.message}`)
  })
}

module.exports = { startBot, triggerRandomMove, getMoveHistory: () => moveHistory };