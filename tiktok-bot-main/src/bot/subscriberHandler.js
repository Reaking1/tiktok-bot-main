import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import { hasSubscribed, markSubscriber } from "../utils/streamAudienceStore.js";

export async function onSubscribe(data) {
  const userId = data.userId;
  const name = data.uniqueId;

  if (!userId || !name) return;
  if (hasSubscribed(userId)) return;

  markSubscriber(userId);

  logger.event("SUBSCRIBE", `${name} subscribed`);

  await speak(`Welcome ${name}! Thank you for subscribing!`);
}
