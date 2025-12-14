// test.js (local terminal tester)

import readline from "readline";
import {logger} from "./src/utils/logger.js";
import { onChat } from "./src/bot/chatHandler.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

logger.success("🧪 Local ChatBot Terminal Test Started");
logger.info("Type messages as if you're a TikTok user.");
logger.info("Example: 'hi', 'how are you', 'like the stream', etc.");
console.log("\n");

function ask() {
    rl.question("You: ", async (input) => {
        if (input.toLowerCase() === "exit") {
            logger.info("🛑 Test session ended.");
            rl.close();
            return;
        }

        await onChat("TestUser", input);

        ask();
    });
}

ask();
