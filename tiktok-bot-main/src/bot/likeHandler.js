import { logger } from "../utils/logger";
import { recordLike } from "../utils/userStore";

const LIKE_MILESTONES = [10, 25, 50, 100];

export async function onlike(user, likeAmount) {
  recordLike(user, likeAmount);

  //Check milestones
  if (LIKE_MILESTONES.includes(user.like)) {
    logger.success(`❤️ ${user.name} reached ${user.likes} likes!`);

    //later:
    //speak("Thanks for the likes")
  }
}
