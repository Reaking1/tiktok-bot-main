import dotenv from "dotenv";
dotenv.config();

console.log("✅ ENV LOADED:", {
  ELEVENLABS_API_KEY: !!process.env.ELEVENLABS_API_KEY,
  ELEVENLABS_DEFAULT_VOICE: process.env.ELEVENLABS_DEFAULT_VOICE,
});
