import { isOnCooldown } from "../utils/cooldown.js";
import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";

/**
 * GiftHandler encapsulates all gift logic
 */
class GiftHandler {
  constructor(options = {}) {
    this.tts = options.ttsService || { playTTS: speak };
    this.cooldownSeconds = options.giftCooldown ?? 5; // seconds
  }

  /**
   * Handle TikTok gift event
   * @param {object} data
   */
  async handleGift(data) {
    try {
      const username = data?.uniqueId || "Unknown user";
      const giftName = data?.giftName || "Gift";
      const repeatEnd = data?.repeatEnd ?? false;
      const finalCount = data?.repeatCount ?? 1;

      // Only react when gift combo is finished
      if (!repeatEnd) return;

      // Cooldown protection
      if (isOnCooldown(username, this.cooldownSeconds)) {
        logger.info(`Cooldown active for ${username}, skipping gift.`);
        return;
      }

      logger.info(`🎁 Gift from ${username}: ${giftName} x${finalCount}`);

      const message = `Thank you ${username} for the ${giftName}! You are awesome!`;

      await this.tts.playTTS(message);
    } catch (err) {
      logger.error("Failed to process gift", err);
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
export async function onGift(data) {
  return giftHandler.handleGift(data);
}

// Optional named export if you ever need the class
export { GiftHandler };
