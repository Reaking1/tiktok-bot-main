const logger = require("../utils/logger");
const cooldown = require("../utils/cooldown");
const TTSService = require("../services/ttsService");

class GiftHandler {
    constructor(options = {}) {
        this.tts = options.ttsService || new TTSService();
        this.cooldown = options.cooldown || cooldown;
        this.giftCooldown = options.giftCooldown || 5000;// 5 seconds by default
    }
 /**
     * Handle TikTok gift event
     * @param {object} data - Raw gift event data from TikTok
     */

 async handleGift(data) {
    try {
        //Extract useful info
        const username = data?.uniqueId || "Unknown user";
        const giftName = data?.giftName || "Gift";
        const repeatEnd = data?.repeatEnd || false;
        const finalCount = data?.repeatCount || 1;

                // Avoid processing gifts before combo is finalized  
                if(!repeatEnd) return;

                //Prevent spam using cooldown
                if(this.cooldown.isOnCooldown(username)) {
                    logger.info(`Cooldown active for ${username}, skipping gift response.`);
                    return;
                }
                this.cooldown.addCooldown(username, this.giftCooldown);
                logger.info(`🎁 Gift from ${username}: ${giftName} x${finalCount}`);
                

                //Create TTS message
                const message = `Thank you ${username} for the ${giftName}! You are awesome!`;


                //Play TTS
                await this.tts.playTTS(message);
    } catch (err) {
   logger.error("Failed to process gift", err);
    }
 }

}

module.exports = GiftHandler;