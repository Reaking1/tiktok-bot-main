import "./bootstrap.js";

import { TikTokLiveConnection } from "tiktok-live-connector";
import config from "./config/default.js";
import { logger } from "./src/utils/logger.js";
import { getUser, recordLike, recordGift } from "./src/utils/userStore.js";
import { onChat } from "./src/bot/chatHandler.js";
import { onGift } from "./src/bot/giftHandler.js";
import {
  handleChatMilestone,
  handleGiftMilestone,
  handleLikeMilestone,
} from "./src/bot/milestoneHnadler.js";

const tiktokLive = new TikTokLiveConnection(config.tiktokUsername, {
  enableWebsocketFallback: true,
});

tiktokLive
  .connect()
  .then((state) => {
    logger.success(`🎉 Connected to @${config.tiktokUsername}`);
    logger.info(`👀 Viewers: ${state.viewerCount ?? "N/A"}`);
  })
  .catch((err) => logger.error(err.message));

// Chat
tiktokLive.on("chat", async (data) => {
  await onChat(data);
});

// Like
tiktokLive.on("like", async (data) => {
  const user = getUser(data);
  const amount = data.likeCount || 1;

  recordLike(user, amount);
  logger.event("LIKE", `${user.name} → ${user.likes}`);

  await handleLikeMilestone(user);
});

// Gift
tiktokLive.on("gift", async (data) => {
  const user = getUser(data);

  recordGift(user, data.diamondCount || 1);
  logger.event("GIFT", `${user.name} sent ${data.giftName}`);

  await onGift(user, data);
  await handleGiftMilestone(user);
});
