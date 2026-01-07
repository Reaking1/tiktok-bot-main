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
      lastSpokeAt: 0,
    };
  }

  if (!users.has(id)) {
    users.set(id, {
      id,
      name: data.uniqueId || data.nickname || "Guest",
      likes: 0,
      chats: 0,
      lastSpokeAt: 0,
    });
  }

  return users.get(id);
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
 * Update last spoken timestamp
 */
export function markSpoken(user) {
  user.lastSpokeAt = Date.now();
}
