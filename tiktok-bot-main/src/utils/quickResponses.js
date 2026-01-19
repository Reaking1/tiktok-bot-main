import path from "path";
import { playAudio } from "./audioPlayer.js";
import { logger } from "./logger.js";

// Base audio directory
const AUDIO_BASE = path.join(process.cwd(), "audio", "system");

/**
 * All fixed / system responses
 * These should be PRE-RECORDED audio files
 */
export const QUICK_RESPONSES = {
  AI_LOCKED: {
    audio: "ai_locked.mp3",
    text: "AI chat is for subscribers only.",
  },

  HOW_TO_UNLOCK: {
    audio: "how_to_unlock.mp3",
    text: "Subscribe to unlock AI chat features.",
  },

  PERK_INFO: {
    audio: "perk_info.mp3",
    text: "Members get more AI responses and priority access.",
  },

  CHAT_LIMIT_REACHED: {
    audio: "chat_limit_reached.mp3",
    text: "You have reached your AI response limit.",
  },

  SUB_WELCOME: {
    audio: "sub_welcome.mp3",
    text: "Welcome! Enjoy your subscriber perks.",
  },
};

/**
 * Play a system response by key
 * @param {keyof QUICK_RESPONSES} key
 */
export async function playQuickResponse(key) {
  const response = QUICK_RESPONSES[key];

  if (!response) {
    logger.warn(`⚠️ Unknown quick response: ${key}`);
    return;
  }

  const audioPath = path.join(AUDIO_BASE, response.audio);

  try {
    logger.info(`🔈 System audio: ${key}`);
    await playAudio(audioPath);
  } catch (err) {
    logger.error(`❌ Failed to play system audio: ${key}`, err);
  }
}

/**
 * Optional helper: return text only
 * Useful for logging or chat messages
 */
export function getQuickResponseText(key) {
  return QUICK_RESPONSES[key]?.text || "";
}
