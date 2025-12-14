import "dotenv/config"; // MUST be first

import { TikTokLiveConnection } from "tiktok-live-connector";
import chalk from "chalk";
import config from "./config/default.js";
import { onChat } from "./src/bot/chatHandler.js";
import { onGift } from "./src/bot/giftHandler.js";
import { logger } from "./src/utils/logger.js";

// Create the connection
const tiktokUsername = config.tiktokUsername;

const tiktokLive = new TikTokLiveConnection(tiktokUsername, {
    enableWebsocketFallback: true
});

// Connect
tiktokLive.connect()
    .then(state => {
        logger.success(`🎉 Connected to @${tiktokUsername}'s LIVE!`);
        logger.info(`👀 Viewers: ${state.viewerCount}`);
    })
    .catch(err => logger.error(`❌ Failed to connect: ${err.message}`));

// Chat event
tiktokLive.on("chat", async (data) => {
    logger.info(`💬 ${data.uniqueId}: ${data.comment}`);
    await onChat(data.uniqueId, data.comment);
});

// Gift event
tiktokLive.on("gift", async (data) => {
    logger.event("GIFT", data.giftName);
    await onGift(data);
});

// Like event
tiktokLive.on("like", (data) => {
    logger.event("LIKE", data.uniqueId);
});
