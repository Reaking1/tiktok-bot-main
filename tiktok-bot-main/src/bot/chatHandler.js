import { speak } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";
import { getUser, recordChat, markAIReply } from "../utils/userStore.js";
import { canUseAI } from "../utils/aiPermissionGate.js";
import { generateAIResponse } from "../services/aiService.js";

export async function onChat(data) {
  const user = getUser(data);
  recordChat(user);

  const message = data.comment?.toLowerCase() || "";

  const emoji = user.isSubscriber ? "👻✨" : user.isTopGifter ? "👻🔥" : "👻";

  logger.info(`${emoji} ${user.name}: ${message}`);

  // Ignore empty or non-question messages
  if (!message || !message.includes("?")) return;

  // AI permission gate
  const gate = canUseAI(user);
  if (!gate.allowed) {
    logger.info(`🤖 AI blocked for ${user.name}: ${gate.reason}`);
    return;
  }

  const aiReply = await generateAIResponse(message);
  await speak(aiReply);
  markAIReply(user);
}
