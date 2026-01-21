// src/bot/likeHandler.js
import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import {
  recordStreamLikes,
  hasHitLikeMilestone,
  markLikeMilestone,
} from "../utils/streamStore.js";
import { isOnCooldown } from "../utils/cooldown.js";

const LIKE_MILESTONES = [100, 500, 1000, 2000, 5000];
const COOLDOWN_KEY = "stream-like-tts";

export async function onLike(data) {
  try {
    const amount = data?.likeCount || 1;
    const totalLikes = recordStreamLikes(amount);

    logger.event("LIKE", `❤️ Stream likes → ${totalLikes}`);

    for (const milestone of LIKE_MILESTONES) {
      if (totalLikes >= milestone && !hasHitLikeMilestone(milestone)) {
        markLikeMilestone(milestone);

        // Protect TTS from spam
        if (isOnCooldown(COOLDOWN_KEY, 15)) {
          logger.info("❤️ Like milestone reached but TTS on cooldown");
          return;
        }

        const message = `❤️ Thank you for ${milestone.toLocaleString()} likes!`;

        logger.success(message);
        await speak(message);
        return;
      }
    }
  } catch (err) {
    logger.error("LikeHandler failed", err);
  }
}
