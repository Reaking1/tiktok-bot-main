const logger = require("../utils/logger");
const axios = require("axios");

class AIHAndler {
    constructor(apiKey, model = "gpt-4o-mini") {
        if(!apiKey) throw new Error("AI API key is missing");
        this.apiKey = apiKey;
        this.model = model;
    }

        /**
     * Sends a message to the AI model for generation
     * @param {string} prompt - User message or processed content
     * @returns {Promise<string>} - AI response
     */
     
    async generateResponse(prompt) {
        try {
            logger.info(`🤖 Sending prompt to AI: "${prompt}"`);

            const response = await axios.post(
                  "https://api.openai.com/v1/chat/completions",
                  {
                    model: this.model,
                    messages: [
                        {
                            role: "system",
                            content: 
                            "You are a TikTok livestream assistant. Your responses must be short, friendly, and fun."
                        },
                        {
                            role: "user",
                            content: prompt
                        }
                    ],
                    max_tokens: 100
                  },
                  {
                    headers: {
                        Authorization:`Bearer ${this.apiKey}`,
                        "Content-Type": "application/json"
                    }
                  }
            );
            const aiMessage = response.data.choices[0].message.content.trim();
            logger.info(`🤖 AI response: "${aiMessage}"`);
            return aiMessage;
        } catch (error) {
            logger.error("AI generation failed: ", err.response?.data || err.message);
            return "Sorry, I couldn't think of a response right now.";
        }
    }
}