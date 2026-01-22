import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import { hasSeenViewer, markViewer } from "../utils/streamAudienceStore.js";
import { isOnCooldown } from "../utils/cooldown.js";

const VIEWER_AUDIO_COOLDOWN = 20; // seconds (GLOBAL)

export async function onViewer(data) {
  const userId = data.userId;
  const name = data.uniqueId;

  if (!userId || !name) return;

  // Only first-time viewers this stream
  if (hasSeenViewer(userId)) return;

  // Global cooldown to avoid spam
  if (isOnCooldown("viewer-audio", VIEWER_AUDIO_COOLDOWN)) {
    logger.info(`👀 Viewer audio cooldown active`);
    markViewer(userId); // still mark them
    return;
  }

  markViewer(userId);

  logger.event("VIEWER", `${name} joined`);

  try {
    await speak(`Welcome to the stream, ${name}`);
  } catch (err) {
    logger.error("Viewer TTS failed", err);
  }
}
