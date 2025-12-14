// 1️⃣ Load .env FIRST
import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // make sure this path points to your .env file

// 2️⃣ Your imports after dotenv
import "./config/default.js";
import { speak } from "./src/services/ttsService.js";
import { logger } from "./src/utils/logger.js";

// 3️⃣ Debug: Check API key is loaded
console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY);

logger.success("🧪 Audio test starting...");

await speak("Hello Ghost. This is a local audio test using Eleven Labs");

logger.success("🧪 Audio test finished.");
