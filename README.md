# Discord VC Join Sound

Discord VC Join Sound is a simple application that creates a Discord client using a Discord user token. The bot plays a sound whenever someone joins a specified voice channel.

## Getting Your Discord Token

To use this application, you need your Discord user token. Follow these steps to retrieve it:

1. Open Discord in your browser.
2. Press `Ctrl + Shift + I` to open the Developer Tools.
3. Navigate to the Console tab.
4. Paste the following code and press `Enter`:

   ```javascript
   window.webpackChunkdiscord_app.push([
     [Math.random()],
     {},
     req => {
       if (!req.c) return;
       for (const m of Object.keys(req.c)
         .map(x => req.c[x].exports)
         .filter(x => x)) {
         if (m.default && m.default.getToken !== undefined) {
           return copy(m.default.getToken());
         }
         if (m.getToken !== undefined) {
           return copy(m.getToken());
         }
       }
     },
   ]);
   console.log('%cWorked!', 'font-size: 50px');
   console.log(`%cYou now have your token in the clipboard!`, 'font-size: 16px');
   ```

5. After running the code, your token will be copied to your clipboard.

**Important:** Do not share your Discord token with anyone! It grants full access to your account.

## Configuration

Once you have your Discord token, follow these steps to set up the application:

1. Open the app.
2. Enter your Discord token in the "Discord Token" field.
3. Enter the Channel ID of the voice channel you want to monitor.
4. Click on "Save and Start Bot" to start the bot.

## Download

You can download the latest release of Discord VC Join Sound from the following link:

[Download Discord VC Join Sound](https://github.com/Knocklive/discord-vc-join-sound/releases/)

## Disclaimer

Please use this application responsibly and ensure that you comply with Discord's terms of service.
