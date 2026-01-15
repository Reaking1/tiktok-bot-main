import { logger } from "../utils/logger.js";
import { recordLike } from "../utils/userStore.js";

const LIKE_MILESTONES = [10, 25, 50, 100];

export async function onLike(user, likeAmount = 1) {
  recordLike(user, likeAmount);

  for (const milestone of LIKE_MILESTONES) {
    if (user.likes >= milestone && !user.hitLikeMilestones.has(milestone)) {
      user.hitLikeMilestones.add(milestone);

      logger.success(`❤️ ${user.name} reached ${milestone} likes!`);

      // later:
      // await speak(`Thank you ${user.name} for ${milestone} likes!`)
    }
  }
}
