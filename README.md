# Discord VC Join Sound

**Discord Support Bot** is a lightweight desktop application that plays a custom sound when someone joins a monitored voice channel. It supports multiple channels, user filters, and advanced auto-move functionalities to streamline your Discord support experience.

---

## 🎥 Preview

<img src="https://upload.knocklive.de/uploads/inbb6bly.gif" alt="Preview" width="350"/>

---

## ✨ Features

- **Multi-Channel Monitoring**
  Monitor multiple voice channels simultaneously.

- **Join Sound Notification**
  Plays a sound when someone joins one of your selected channels.

- **Custom Sound**
  Choose and use your own `.mp3` or `.wav` file.

- **Advanced Sound Filters**
  Whitelist or blacklist users based on:
  - Username
  - Display name
  - Server nickname

- **Auto Move System**
  With a single hotkey or key combination, automatically move a random user from your predefined support queue into your current voice channel.

- **Auto Move Filters**
  Use the same user filters for auto move to ensure only the right users are picked.

---

## 🛠 Getting Your Discord Token

> **⚠️ Warning:** Your token grants full access to your account. Keep it **private** and do **not share it**.

1. Go to [Discord Web](https://discord.com/channels/@me).
2. Press `Ctrl + Shift + I` to open Developer Tools.
3. Go to the **Console** tab.
4. If needed, type `allow pasting` and press Enter to enable pasting.
5. Paste and run this code:

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

6. Your token is now copied to your clipboard.

---

## ⚙️ Configuration

1. Launch **Discord VC Join Sound**.
2. Enter your **Discord Token**.
3. Enter the **Voice Channel IDs** you want to monitor.
4. Configure everything according to your wishes.
5. Click **Save and Start Bot**.

---

## ⬇️ Download

👉 [Download the latest version here](https://github.com/Knocklive/discord-vc-join-sound/releases/)

---

## 📜 Disclaimer

This app uses a user token to simulate a client. This is **against Discord’s Terms of Service** and may lead to a **ban**. Use it at your own risk, and **only on accounts you control**. We are not responsible for any consequences.