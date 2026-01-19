const stream = {
  totalLikes: 0,
  hitLikeMilestones: new Set(),
};

export function recordStreamLikes(amount = 1) {
  stream.totalLikes += amount;
  return stream.totalLikes;
}

export function hasHitLikeMilestone(milestone) {
  return stream.hitLikeMilestones.has(milestone);
}

export function markLikeMilestone(milestone) {
  stream.hitLikeMilestones.add(milestone);
}

export function getTotalLikes() {
  return stream.totalLikes;
}
