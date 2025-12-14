import { speak } from "../services/ttsService.js";
import { logger } from "../utils/logger.js";

export async function onChat(user, message) {
    logger.info(`ChatHandler received message from ${user}: ${message}`);

    if (message.includes("hi")) {
        await speak(`Hello ${user}, welcome to the live!`);
        logger.success("Greeting sent!");
    }
}
