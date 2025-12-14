import TikTokLiveConnection from "tiktok-live-connector";
import {config} from "../config/config.js";
import {logger} from "../utils/logger.js";

// ----------------------------------------------------
// Create TikTok Live Connection
// ----------------------------------------------------
let tiktokLive = new TikTokLiveConnection(config.tiktokUsername, {
    enableWebsocketFallback: true,
});

// ----------------------------------------------------
// Connect to TikTok Live
// ----------------------------------------------------
async function startConnection() {
    try {
        const state = await tiktokLive.connect();
        logger.success(
            `Connected to @${config.tiktokUsername} LIVE — Viewers: ${state.viewerCount}`
        );
    } catch (err) {
        logger.error("Failed to connect to TikTok Live: " + err.message);
    }
}

// ----------------------------------------------------
// Auto-Reconnect on Disconnect
// ----------------------------------------------------
tiktokLive.on("disconnected", () => {
    logger.warning("Disconnected. Attempting to reconnect in 5 seconds...");
    setTimeout(startConnection, 5000);
});

// ----------------------------------------------------
// Export service for other handlers
// ----------------------------------------------------
export { tiktokLive, startConnection };
