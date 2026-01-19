// In-memory store (resets when stream restarts)
const users = new Map();

/**
 * Normalize TikTok user data across ALL events
 * @param {object} data - raw TikTok event data
 */
export function getUser(data) {
  // TikTok sends user info differently per event
  const rawUser = data?.user || data?.sender || data;

  const id =
    rawUser?.userId ||
    rawUser?.uniqueId ||
    rawUser?.secUid ||
    rawUser?.nickname;

  const name = rawUser?.uniqueId || rawUser?.nickname || "Guest";

  // Shared fallback user (prevents undefined spam)
  if (!id) {
    if (!users.has("unknown")) {
      users.set("unknown", {
        id: "unknown",
        name: "Guest",

        likes: 0,
        chats: 0,
        giftTotal: 0,

        isSubscriber: false,
        isTopGifter: false,

        lastSeen: Date.now(),
        lastAIReplyAt: 0,

        // milestone tracking
        hitLikeMilestones: new Set(),
        hitGiftMilestones: new Set(),
      });
    }
    return users.get("unknown");
  }

  // Create user if first seen
  if (!users.has(id)) {
    users.set(id, {
      id,
      name,

      likes: 0,
      chats: 0,
      giftTotal: 0,

      isSubscriber: false,
      isTopGifter: false,

      lastSeen: Date.now(),
      lastAIReplyAt: 0,

      // milestone tracking
      hitLikeMilestones: new Set(),
      hitGiftMilestones: new Set(),
    });
  }

  const user = users.get(id);

  // Always refresh mutable fields
  user.name = name;
  user.lastSeen = Date.now();

  return user;
}

/* ------------------ RECORDERS ------------------ */

export function recordChat(user) {
  user.chats += 1;
}

export function recordLike(user, amount = 1) {
  user.likes += amount;
}

export function recordGift(user, amount = 1) {
  user.giftTotal += amount;

  // Example threshold for top gifter
  if (user.giftTotal >= 100) {
    user.isTopGifter = true;
  }
}

/* ------------------ FLAGS ------------------ */

export function markSubscriber(user, data) {
  user.isSubscriber = !!data?.isSubscriber;
}

export function markAIReply(user) {
  user.lastAIReplyAt = Date.now();
}
