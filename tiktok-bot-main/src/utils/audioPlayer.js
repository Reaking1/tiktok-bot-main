import fs from "fs";
import path from "path";
import { logger } from "./logger.js";

const OBS_AUDIO_PATH =
  process.env.OBS_AUDIO_PATH || "C:/tiktok-bot/audio/latest.mp3";

/**
 * Send audio to OBS by overwriting the watched file
 * @param {string} filePath
 */
export async function playAudio(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      logger.error(`❌ Audio file not found: ${filePath}`);
      return;
    }

    // Ensure directory exists
    fs.mkdirSync(path.dirname(OBS_AUDIO_PATH), { recursive: true });

    // Copy TTS file → OBS watched file
    fs.copyFileSync(filePath, OBS_AUDIO_PATH);

    logger.success(`🎧 Sent audio to OBS: ${OBS_AUDIO_PATH}`);
  } catch (err) {
    logger.error(`❌ OBS audio handoff failed: ${err.message}`);
  }
}
