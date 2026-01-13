//In-memory store (resets when stream restarts)
const users = new Map();

/**
 * Normalize TikTok user data
 * @param {object} data - raw Tiktok event data
 */
export function getUser(data) {
  const id = data.userId || data.uniqueId || data.nickname;

  if (!id) {
    return {
      id: "unknown",
      name: "Guest",
      likes: 0,
      chats: 0,
      giftTotal: 0,
      isSubscriber: false,
      isTopGifter: false,
      lastSpokeAt: 0,
      lastSeen: Date.now(),
      lastAIReplyAt: 0,
    };
  }

  if (!users.has(id)) {
    users.set(id, {
      id,
      name: data.uniqueId || data.nickname || "Guest",
      likes: 0,
      chats: 0,
      giftTotal: 0,
      isSubscriber: false,
      isTopGifter: false,
      lastSpokeAt: 0,
      lastSeen: Date.now(),
      lastAIReplyAt: 0,
    });
  }

  const user = users.get(id);
  user.lastSeen = Date.now();

  return user;
}

/**
 * Increment chat count
 */
export function recordChat(user) {
  user.chats += 1;
}

/**
 * Increment likes
 */
export function recordLike(user, amount = 1) {
  user.likes += amount;
}

/**
 * Add gift value
 */
export function recordGift(user, amount = 1) {
  user.giftTotal += amount;

  //Example threshold
  if (user.giftTotal >= 100) {
    user.isTopGifter = true;
  }
}

/**
 * Update last spoken timestamp
 */
export function markSpoken(user) {
  user.lastSpokeAt = Date.now();
}

/**
 * Update subscriber status
 */
export function markSubscriber(user, data) {
  user.isSubscriber = !!data.isSubscriber;
}

/**
 * Update the AI reply
 */
export function markAIReply(user) {
  user.lastAIReplyAt = Date.now();
}
