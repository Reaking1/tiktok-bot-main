//Stores timestamp for each cooldown key
const cooldown = new Map();


/**
 * Checks if an action is on cooldown.
 * If not on cooldown, it stores the new timestamp.
 *
 * @param {string} key - the cooldown name (e.g. "likeReminder")
 * @param {number} seconds - cooldown duration in seconds
 * @returns {boolean} true if cooldown is active, false if allowed
 */

export function isOnCooldown(key,seconds) {
    const now = Date.now();


    //if cooldown exists
    if(cooldown.has(key)) {
        const lastUsed = cooldown.get(key);
        const diff = (now -lastUsed) / 1000;

        if(diff < seconds) {
            return true;
        }
    }

    //Not on cooldown -> set new timestamp
    cooldown.set(key, now);
    return false;
}

/**
 * Clears a specific cooldown manually (optional)
 * @param {string} key
 *
 */

export function clearCooldown(key) {
    cooldown.delete(key);
}


/**
 * Clears ALL cooldowns (optional)
 */
export function clearAllCooldown() {
    cooldown.clear();
}