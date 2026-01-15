import OpenAI from "openai";
import { logger } from "../utils/logger.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an AI response
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function generateAIResponse(prompt) {
  if (!prompt || prompt.trim().length < 2) {
    return "";
  }

  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini", // cheaper + better than 3.5
      input: [
        {
          role: "system",
          content:
            "You are a TikTok livestream assistant. Replies must be short, friendly, and spoken aloud.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_output_tokens: 60,
      temperature: 0.7,
    });

    return (
      response.output_text?.trim() || "👻 I’m not sure how to answer that."
    );
  } catch (err) {
    logger.error(`AI error: ${err.message}`);
    return "👻 My brain lagged for a second.";
  }
}
