import fs from "fs";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";
import { logger } from "../utils/logger.js";
import { playAudio } from "../utils/audioPlayer.js";

// ES module dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Env vars (already loaded by entry file)
const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE;

// 🔐 Fail fast if key missing
if (!API_KEY) {
  throw new Error("❌ ELEVENLABS_API_KEY is missing. Check your .env file.");
}

if (!DEFAULT_VOICE) {
  throw new Error("❌ ELEVENLABS_DEFAULT_VOICE is missing.");
}

// Audio output directory
const AUDIO_OUTPUT = path.join(__dirname, "../../audio");
if (!fs.existsSync(AUDIO_OUTPUT)) {
  fs.mkdirSync(AUDIO_OUTPUT, { recursive: true });
}

/**
 * Generate TTS using ElevenLabs (2025 API)
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
          "Accept": "audio/mpeg",
        },
        responseType: "arraybuffer",
        timeout: 30_000,
      }
    );

    const fileName = `tts_${Date.now()}.mp3`;
    const filePath = path.join(AUDIO_OUTPUT, fileName);

    fs.writeFileSync(filePath, response.data);

    logger.success(`🎧 ElevenLabs TTS saved: ${filePath}`);
    await playAudio(filePath);

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
