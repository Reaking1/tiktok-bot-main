import player from "play-sound";
import { logger } from "./logger.js";

const audioPlayer = player();
const ENABLE_AUDIO = process.env.ENABLE_AUDIO_PLAYBACK === "true"; // must explicitly be "true"

/**
 * Play audio file
 * @param {string} filePath
 */
export function playAudio(filePath) {
  return new Promise((resolve, reject) => {
    if (!ENABLE_AUDIO) {
      logger.info(
        `🔇 Audio playback disabled (ENABLE_AUDIO_PLAYBACK not true)`,
      );
      return resolve();
    }

    logger.info(`🎵 Playing audio: ${filePath}`);

    // Windows-safe
    audioPlayer.play(
      filePath,
      { afplay: [], mpg123: [], mplayer: [] },
      (err) => {
        if (err) {
          logger.error(`❌ Audio playback failed: ${err.message}`);
          return reject(err);
        }

        logger.success(`🔊 Audio played successfully`);
        resolve();
      },
    );
  });
}
