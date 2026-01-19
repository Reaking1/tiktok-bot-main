import { speak } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";
import { getUser, recordChat, markAIReply } from "../utils/userStore.js";
import { canUseAI } from "../utils/aiPermissionGate.js";

/**
 * Handle TikTok chat messages
 * @param {object} data - TikTok chat event data
 */
export async function onChat(data) {
  const user = getUser(data);
  recordChat(user);

  const message = data.comment?.trim();
  if (!message) return; // Ignore empty messages

  const emoji = user.isSubscriber ? "👻✨" : user.isTopGifter ? "👻🔥" : "👻";
  logger.info(`${emoji} ${user.name}: ${message}`);

  // Only react to questions
  if (!message.includes("?")) return;

  // Check AI access via subscriber status & perk limits
  const gate = canUseAI(user);
  if (!gate.allowed) {
    // Quick, low-cost denial TTS
    const denyMessage =
      gate.reason === "not-permitted"
        ? `Sorry ${user.name}, AI chat is for subscribers only.`
        : `Hey ${user.name}, you need to wait a bit before using AI again.`;

    logger.info(`🤖 AI denied for ${user.name}: ${gate.reason}`);
    await speak(denyMessage);
    return;
  }

  // AI access allowed → optional response
  const aiMessage = `Hey ${user.name}, enjoy your AI chat perks!`;
  logger.info(`🤖 AI responding to ${user.name}`);

  await speak(aiMessage);
  markAIReply(user);
}
