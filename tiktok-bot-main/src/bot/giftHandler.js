import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import { recordGift } from "../utils/userStore.js";
import { isOnCooldown } from "../utils/cooldown.js";

/**
 * GiftHandler encapsulates ALL gift logic
 */
class GiftHandler {
  constructor(options = {}) {
    this.cooldownSeconds = options.giftCooldown ?? 8; // seconds
  }

  /**
   * Handle TikTok gift event
   * @param {object} user - normalized user from userStore
   * @param {object} data - raw TikTok gift event
   */
  async handleGift(user, data) {
    try {
      const giftName = data?.giftName || "a gift";
      const diamondCount = data?.diamondCount || 1;
      const repeatEnd = data?.repeatEnd ?? true;

      // Only react when gift combo is finished
      if (!repeatEnd) return;

      // Track gift value per user
      recordGift(user, diamondCount);

      // Cooldown per USER (not username string)
      if (isOnCooldown(user.id, this.cooldownSeconds)) {
        logger.info(`🎁 Gift cooldown active for ${user.name}`);
        return;
      }

      logger.event(
        "GIFT",
        `${user.name} sent ${giftName} (${diamondCount} coins)`,
      );

      // ---- TTS RULES ----
      // Only speak for meaningful gifts
      if (diamondCount < 10) return;

      const message =
        diamondCount >= 100
          ? `🔥 Massive thanks ${user.name} for ${diamondCount} coins!`
          : `Thank you ${user.name} for the ${giftName}!`;

      await speak(message);
    } catch (err) {
      logger.error("GiftHandler failed", err);
    }
  }
}

/* --------------------------------------------------
   SINGLETON + EVENT HANDLER EXPORT
-------------------------------------------------- */

const giftHandler = new GiftHandler();

/**
 * This is what index.js imports
 */
export async function onGift(user, data) {
  return giftHandler.handleGift(user, data);
}

// Optional named export
export { GiftHandler };
