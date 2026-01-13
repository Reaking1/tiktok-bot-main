// src/services/aiService.js
import OpenAI from "openai";
import { logger } from "../utils/logger.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an AI response for TikTok chat
 * @param {string} message
 * @returns {Promise<string>}
 */
export async function generateAIResponse(message) {
  try {
    if (!message || message.length < 2) {
      return "";
    }

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a witty TikTok assistant. Keep replies short and friendly.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    return response.choices?.[0]?.message?.content.trim() || "";
  } catch (error) {
    logger.error(`AI error: ${error.message}`);
    return "👻 I got confused for a second...";
  }
}
