import "./config/default.js"
import { speak } from "./src/services/ttsService.js"
import { logger } from "./src/utils/logger.js"


logger.success("🧪 Audio test starting...");


await speak("Hello Ghost. This is a local audio test using Eleven Labs");

logger.success("🧪 Audio test finished.")