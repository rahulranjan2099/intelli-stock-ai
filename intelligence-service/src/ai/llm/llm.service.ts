import { HumanMessage } from "@langchain/core/messages";

import { LLMFactory } from "./llm.factory";

export class LLMService {
    private readonly llm = LLMFactory.create();

    async ask(prompt: string): Promise<string> {
        const response = await this.llm.invoke([
            new HumanMessage(prompt),
        ]);
        return response.text
    }
}