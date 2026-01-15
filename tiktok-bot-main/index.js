import "./bootstrap.js"; // MUST be first

import { TikTokLiveConnection } from "tiktok-live-connector";
import chalk from "chalk";
import config from "./config/default.js";
import { onChat } from "./src/bot/chatHandler.js";
import { onGift } from "./src/bot/giftHandler.js";
import { logger } from "./src/utils/logger.js";
import { getUser, recordChat, recordLike } from "./src/utils/userStore.js";
import {
  handleChatMilestone,
  handleGiftMilestone,
  handleLikeMilestone,
} from "./src/bot/milestoneHnadler.js";

// Create the connection
const tiktokUsername = config.tiktokUsername;

const tiktokLive = new TikTokLiveConnection(tiktokUsername, {
  enableWebsocketFallback: true,
});

// Connect
tiktokLive
  .connect()
  .then((state) => {
    logger.success(`🎉 Connected to @${config.tiktokUsername}'s LIVE!`);
    logger.info(`👀 Viewers: ${state.viewerCount ?? "N/A"}`);
  })
  .catch((err) => logger.error(`❌ Failed to connect: ${err.message}`));

// Chat event
tiktokLive.on("chat", async (data) => {
  const user = getUser(data);
  recordChat(user);

  logger.info(`💬 ${user.name}: ${data.comment}`);
  await onChat(user, data.comment);

  await handleChatMilestone(user);
});

// Gift event
tiktokLive.on("gift", async (data) => {
  const user = getUser(data);

  logger.event("GIFT", `${user.name} sent ${data.giftName}`);
  await onGift(user, data);

  await handleGiftMilestone(user);
});

// Like event
tiktokLive.on("like", async (data) => {
  const user = getUser(data);

  //TikTok sends LikeCount sometimes
  const likeAmount = data.likeCount || 1;
  recordLike(user, likeAmount);

  logger.event("LIKE", `${user.name}  → ${user.likes} total likes `);

  await handleLikeMilestone(user);
});
