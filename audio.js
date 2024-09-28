const player = require('play-sound')(opts = {})
const { exec } = require('child_process');
const path = require('path');

function playSound(sendStatus) {
  const soundFile = path.join(process.resourcesPath, 'sound.mp3');

  if (process.platform === 'win32') {
    const cmdmp3Path = path.join(process.resourcesPath, 'cmdmp3.exe');
    exec(`${cmdmp3Path} "${soundFile}"`, (error, stdout, stderr) => {
      if (error) {
        console.error('Error playing Sound (cmdmp3):', error);
        console.error('stderr:', stderr);
        sendStatus(`Error playing Sound (cmdmp3): ${error.message}`);
      } else {
        console.log('Played Sound successfully (cmdmp3)');
      }
    });
  } else {
    player.play(soundFile, (err) => {
      if (err) {
        console.error('Error playing Sound (play-sound):', err);
        // afplay (macOS) / aplay (Linux)
        const command = process.platform === 'darwin' ? 'afplay' : 'aplay';
        exec(`${command} "${soundFile}"`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error playing Sound (${command}):`, error);
            console.error('stderr:', stderr);
            sendStatus(`Error playing Sound (${command}): ${error.message}`);
          } else {
            console.log(`Played Sound successfully (${command})`);
          }
        });
      } else {
        console.log('Played Sound successfully');
      }
    });
  }
}

module.exports = { playSound };