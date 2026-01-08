import { speak } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";
import { getUser, markAIReply, recordChat } from "../utils/userStore.js";

export async function onChat(data) {
  const user = getUser(data);
  recordChat(user);

  const message = data.commit?.toLowerCase() || "";
  const emoji = user.isSubscriber ? "👻✨" : user.isTopGifter ? "👻🔥" : "👻";

  logger.info(`${emoji} ${user.name} : ${message}`);

  //Only responf when message is a quetion
  if (!getAdapter.allowed) {
    logger.info(`AI blocked for ${user.name}: ${gate.reason}`);
    return;
  }

  const aiRelpy = await generateAIResponse(message);
  await speak(aiRelpy);
  markAIReply(user);
}
