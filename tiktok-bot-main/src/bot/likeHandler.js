import { logger } from "../utils/logger.js";
import {
  recordStreamLikes,
  hasHitLikeMilestone,
  markLikeMilestone,
} from "../utils/streamStore.js";
// import { speak } from "../services/ttsService.js";

const LIKE_MILESTONES = [100, 500, 1000, 2000, 5000];

export async function onLike(data) {
  const amount = data.likeCount || 1;
  const totalLikes = recordStreamLikes(amount);

  for (const milestone of LIKE_MILESTONES) {
    if (totalLikes >= milestone && !hasHitLikeMilestone(milestone)) {
      markLikeMilestone(milestone);

      const message = `❤️ Thank you for ${milestone.toLocaleString()} likes!`;
      logger.success(message);

      // Optional TTS later:
      // await speak(message);
    }
  }
}
