import player from "play-sound";
import {logger} from "./logger.js";

const audioPlayer = player();


export function playAudio(filePath) {
    return new Promise((resolve, reject) => {
        audioPlayer.play(filePath, (err) => {
            if(err) {
                logger.error(`🔇 Audio playback failed: ${err.message}`)
                reject(err);
            } else {
                   logger.success(`🔊 Audio played: ${filePath}`);
                resolve();
            }
        })
    })
}