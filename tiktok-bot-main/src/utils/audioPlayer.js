import player from "play-sound";
import { logger } from "./logger.js";

const audioPlayer = player();

// Read env once
const ENABLE_AUDIO = process.env.ENABLE_AUDIO_PLAYBACK !== "false";

export function playAudio(filePath) {
  return new Promise((resolve, reject) => {
    // 🔇 Headless / Docker / CI mode
    if (!ENABLE_AUDIO) {
      logger.info(`🔇 Audio playback disabled (ENABLE_AUDIO_PLAYBACK=false)`);
      return resolve();
    }

    audioPlayer.play(filePath, (err) => {
      if (err) {
        logger.error(`🔇 Audio playback failed: ${err.message}`);
        return reject(err);
      }

      logger.success(`🔊 Audio played: ${filePath}`);
      resolve();
    });
  });
}
