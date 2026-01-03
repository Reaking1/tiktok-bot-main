import fs from "fs";
import path from "path";
import axios from "axios";
import { logger } from "../utils/logger.js";
import { playAudio } from "../utils/audioPlayer.js";

// ===== ENV VARS =====
const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE;

// Disable audio playback in Docker / CI
const ENABLE_AUDIO_PLAYBACK = process.env.ENABLE_AUDIO_PLAYBACK === "true";

// ===== VALIDATION =====
if (!API_KEY) {
  logger.error("❌ ELEVENLABS_API_KEY is missing");
  throw new Error("Missing ELEVENLABS_API_KEY");
}

if (!DEFAULT_VOICE) {
  logger.error("❌ ELEVENLABS_DEFAULT_VOICE is missing");
  throw new Error("Missing ELEVENLABS_DEFAULT_VOICE");
}

// ===== AUDIO OUTPUT PATH (Docker-safe) =====
// process.cwd() === /app inside Docker
const AUDIO_OUTPUT = path.join(process.cwd(), "audio");

if (!fs.existsSync(AUDIO_OUTPUT)) {
  fs.mkdirSync(AUDIO_OUTPUT, { recursive: true });
}

/**
 * Generate TTS using ElevenLabs
 */
export async function speak(text, voiceId = DEFAULT_VOICE) {
  try {
    logger.info(`🔊 ElevenLabs TTS generating: "${text}"`);

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.9,
        },
      },
      {
        headers: {
          "xi-api-key": API_KEY,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer",
        timeout: 30_000,
      }
    );

    const fileName = `tts_${Date.now()}.mp3`;
    const filePath = path.join(AUDIO_OUTPUT, fileName);

    fs.writeFileSync(filePath, response.data);

    logger.success(`🎧 ElevenLabs TTS saved: ${filePath}`);

    // 🔇 Only play audio if explicitly enabled
    if (ENABLE_AUDIO_PLAYBACK) {
      await playAudio(filePath);
    }

    return filePath;
  } catch (error) {
    if (error.response) {
      logger.error(
        `❌ ElevenLabs Error ${error.response.status}: ${JSON.stringify(
          error.response.data
        )}`
      );
    } else {
      logger.error(`❌ ElevenLabs TTS Error: ${error.message}`);
    }
    return null;
  }
}
