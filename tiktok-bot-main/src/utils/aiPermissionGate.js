const AI_COOLDOWN_MS = 60_000;
const MIN_CHATS_REQUIRED = 2;

export function canUseAI(user) {
  //Role gate
  if (!user.isSubscriber && !user.isTopGifter) {
    return { allowed: false, reason: "not-permitted" };
  }

  //Minimum engagement
  if (user.chats < MIN_CHATS_REQUIRED) {
    return { allowed: false, reason: "not-enough-chats" };
  }

  //Cooldown
  const now = Date.now();
  if (now - user.lastAIReply < AI_COOLDOWN_MS) {
    return { allowed: false, reason: "cooldown" };
  }
  return { allowed: true };
}
