const audience = {
  viewers: new Set(),
  followers: new Set(),
  subscribers: new Set(),
};

/*------VIEWERS--------*/
export function hasSeenViewer(id) {
  return audience.viewers.has(id);
}

export function markViewer(id) {
  audience.viewers.add(id);
}

/*------FOLLOWERS---------*/
export function hasFollowed(id) {
  return audience.followers.has(id);
}

export function markFollower(id) {
  audience.followers.add(id);
}

/*--------SUBSCRIBERS----------*/
export function hasSubscribed(id) {
  return audience.subscribers.has(id);
}

export function markSubscriber(id) {
  audience.subscribers.add(id);
}
