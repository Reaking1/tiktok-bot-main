import { logger } from "../utils/logger.js";
import { speak } from "../services/ttsService.js";
import { hasSeenViewer, markViewer } from "../utils/streamAudienceStore.js";

export async function onViewer(data) {
  const userId = data.userId;
  const name = data.uniqueId;

  if (!userId || !name) return;
  if (hasSeenViewer(userId)) return;

  markViewer(userId);

  logger.event("VIEWER", `${name} joined`);

  // 🔇 DO NOT greet everyone — only first-time join
  await speak(`Welcome to the stream, ${name}`);
}
