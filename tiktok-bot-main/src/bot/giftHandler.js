import {
  isOnCooldown,
  addCooldown,
  clearCooldown,
  clearAllCooldown,
} from "../utils/cooldown.js";
import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js"; // assuming playTTS is now speak

class GiftHandler {
  constructor(options = {}) {
    this.tts = options.ttsService || { playTTS: speak };
    this.cooldownDuration = options.giftCooldown || 5; // in seconds
  }

  /**
   * Handle TikTok gift event
   * @param {object} data - Raw gift event data from TikTok
   */
  async handleGift(data) {
    try {
      const username = data?.uniqueId || "Unknown user";
      const giftName = data?.giftName || "Gift";
      const repeatEnd = data?.repeatEnd || false;
      const finalCount = data?.repeatCount || 1;

      if (!repeatEnd) return;

      if (isOnCooldown(username, this.cooldownDuration)) {
        logger.info(`Cooldown active for ${username}, skipping gift response.`);
        return;
      }

      // Set cooldown manually if you want extra control
      // addCooldown(username, this.cooldownDuration);

      logger.info(`🎁 Gift from ${username}: ${giftName} x${finalCount}`);

      const message = `Thank you ${username} for the ${giftName}! You are awesome!`;

      await this.tts.playTTS(message);
    } catch (err) {
      logger.error("Failed to process gift", err);
    }
  }
}

export { GiftHandler };
