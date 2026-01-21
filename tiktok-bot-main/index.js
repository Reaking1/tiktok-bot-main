import "./bootstrap.js";

import { TikTokLiveConnection } from "tiktok-live-connector";
import config from "./config/default.js";
import { logger } from "./src/utils/logger.js";
import { onChat } from "./src/bot/chatHandler.js";
import { onGift } from "./src/bot/giftHandler.js";
import { onLike } from "./src/bot/likeHandler.js";
import { onViewer } from "./src/bot/viewerHandler.js";
import { onFollow } from "./src/bot/followerHandler.js";
import { onSubscribe } from "./src/bot/subscriberHandler.js";

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
tiktokLive.on("chat", onChat);

// Like
tiktokLive.on("like", onLike);

// Gift
tiktokLive.on("gift", onGift);

//Viwer
tiktokLive.on("roomUser", onViewer);

//Follower
tiktokLive.on("follow", onFollow);

//Subscriber
tiktokLive.on("subscriber", onSubscribe);
