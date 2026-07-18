import "dotenv/config";

import { ChatOllama } from "@langchain/ollama";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";

import { LLMProvider } from "./models"

export class LLMFactory {
    static create(): BaseChatModel {
        console.log('checkingprocess.env.LLM_PROVIDER', process.env.LLM_PROVIDER)
        switch (process.env.LLM_PROVIDER) {
            case LLMProvider.OLLAMA:
                return new ChatOllama({
                    baseUrl: process.env.OLLAMA_BASE_URL,
                    model: process.env.OLLAMA_MODEL,
                    temperature: 0,
                });
            // case gemini (later)
            default:
                throw new Error("Unsupported LLM Provider.")
        }
    }
}
