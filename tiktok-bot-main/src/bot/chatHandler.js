import { speak } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";
import { getUser, recordChat, markAIReply } from "../utils/userStore.js";
import { canUseAI } from "../utils/aiPermissionGate.js";
import { generateAIResponse } from "../services/aiService.js";

export async function onChat(data) {
  const user = getUser(data);
  recordChat(user);

  const message = data.comment?.trim() || "";

  const emoji = user.isSubscriber ? "👻✨" : user.isTopGifter ? "👻🔥" : "👻";

  logger.info(`${emoji} ${user.name}: ${message}`);

  // Only answer questions
  if (!message.includes("?")) return;

  const gate = canUseAI(user);
  if (!gate.allowed) {
    logger.info(`🤖 AI blocked for ${user.name}: ${gate.reason}`);
    return;
  }

  const aiReply = await generateAIResponse(message);
  if (!aiReply) return;

  await speak(aiReply);
  markAIReply(user);
}
