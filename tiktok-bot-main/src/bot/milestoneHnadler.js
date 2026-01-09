import { speak } from "../services/ttsService.js";
import { logger } from "./logger.js";
import { markAIReply } from "./userStore.js";

const LIKE_MILESTONES = [10, 50, 100, 250, 500];
const CHAT_MILESTONES = [5, 20];
const GIFT_MILESTONES = [50, 100, 250];

export async function handleLikeMilestone(user) {
  if (!LIKE_MILESTONES.includes(user.likes)) return;

  const message = `🔥 ${user.name} just hit ${user.likes} likes! Thank you for the support!`;
  logger.success(message);

  await speak(message);
  markAIReply(user);
}

export async function handleChatMilestone(user) {
  if (!CHAT_MILESTONES.includes(user.chats)) return;

  const message = `👻 ${user.name} is active in the chat! Appreciate you being here.`;
  logger.success(message);

  await speak(message);
  markAIReply(user);
}

export async function handleGiftMilestone(user) {
  if (!GIFT_MILESTONES.includes(user.giftTotal)) return;

  const message = `🎁 Massive thanks to ${user.name} for incredible support!`;
  logger.success(message);

  await speak(message);
  markAIReply(user);
}
