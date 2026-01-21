import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import { hasFollowed, markFollower } from "../utils/streamAudienceStore.js";
import { isOnCooldown } from "../utils/cooldown.js";

export async function onFollow(data) {
  const userId = data.userId;
  const name = data.uniqueId;

  if (!userId || !name) return;
  if (hasFollowed(userId)) return;
  if (isOnCooldown(userId, 20)) return;

  markFollower(userId);

  logger.event("FOLLOW", `${name} followed`);

  await speak(`Thank you ${name} for the follow!`);
}
