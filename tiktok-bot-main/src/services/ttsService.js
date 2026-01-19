import fs from "fs";
import path from "path";
import axios from "axios";
import { logger } from "../utils/logger.js";
import { playAudio } from "../utils/audioPlayer.js";

// ===== ENV VARS =====
const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE;

// Check for required env
if (!API_KEY) {
  logger.error("❌ ELEVENLABS_API_KEY is missing");
  throw new Error("Missing ELEVENLABS_API_KEY");
}
if (!DEFAULT_VOICE) {
  logger.error("❌ ELEVENLABS_DEFAULT_VOICE is missing");
  throw new Error("Missing DEFAULT_VOICE");
}

// ===== AUDIO OUTPUT PATH =====
const AUDIO_OUTPUT = path.join(process.cwd(), "audio");
if (!fs.existsSync(AUDIO_OUTPUT))
  fs.mkdirSync(AUDIO_OUTPUT, { recursive: true });

/**
 * Generate TTS using ElevenLabs
 * @param {string} text - The text to speak
 * @param {string} voiceId - Optional voice override
 */
export async function speak(text, voiceId = DEFAULT_VOICE) {
  if (!text || text.trim().length === 0) return null; // Early return if no text

  try {
    logger.info(`🔊 Generating TTS: "${text}"`);

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.5, similarity_boost: 0.9 },
      },
      {
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
        timeout: 30_000,
      },
    );

    const fileName = `tts_${Date.now()}.mp3`;
    const filePath = path.join(AUDIO_OUTPUT, fileName);
    fs.writeFileSync(filePath, response.data);

    logger.success(`🎧 TTS saved: ${filePath}`);

    // Play audio only if ENABLE_AUDIO_PLAYBACK is true
    if (process.env.ENABLE_AUDIO_PLAYBACK === "true") {
      await playAudio(filePath);
    }

    return filePath;
  } catch (error) {
    if (error.response) {
      logger.error(
        `❌ ElevenLabs Error ${error.response.status}: ${JSON.stringify(
          error.response.data,
        )}`,
      );
    } else {
      logger.error(`❌ ElevenLabs TTS Error: ${error.message}`);
    }
    return null;
  }
}
