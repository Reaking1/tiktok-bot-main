import fs from 'fs';
import path from 'path';
import axios from 'axios';
import {logger} from '../utils/logger.js'
import { playAudio } from '../utils/audioPlayer.js';

//load from .env
const API_KEY = process.env.ELEVENLABS_API_KEY;
const DEFAULT_VOICE = process.env.ELEVENLABS_DEFAULT_VOICE;
console.log("ELEVENLABS_API_KEY:", process.env.ELEVENLABS_API_KEY);



//Create audio directory
const AUDIO_OUTPUT = "./audio";

if(!fs.existsSync(AUDIO_OUTPUT)) {
    fs.mkdirSync(AUDIO_OUTPUT);
}

/**
 * Generate TTS using ElevenLabs
 * @param {string} text - The text to convert to speech
 * @param {string} voiceId - Optional voice override
 * @returns {string|null} - Path to generated audio file
 */
export async function speak(text, voiceId = DEFAULT_VOICE) {
    try {
        logger.info(`🔊 ElevenLabs TTS generating:"${text}"`);

        const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

        const response = await axios.post(
            url,
            {
                   text: text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.9
            }
        },
        {
                headers: {
                    "xi-api-key": API_KEY,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer"
            }
        );

        //Save audio file
        const fileName = `tts_${Date.now()}.mp3`;
        const filePath = path.join(AUDIO_OUTPUT, fileName);

        fs.writeFileSync(filePath, response.data);
        logger.success(`🎧 ElevenLabs TTS saved: ${filePath}`);
        await playAudio(filePath);
        return filePath
    } catch (error) {
        logger.error(`❌ ElevenLabs TTS Error: ${error.message}`);
        return null;
    }
}