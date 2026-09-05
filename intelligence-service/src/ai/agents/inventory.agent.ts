import {
    HumanMessage,
    ToolMessage,
    BaseMessage,
} from "@langchain/core/messages";

import type { StructuredToolInterface } from "@langchain/core/tools";

import { LLMFactory } from "../llm/llm.factory";

import {
    forecastTool,
    recommendOrderTool,
    forecastExplanationTool,
} from "../tools";

export class InventoryAgent {
    private readonly llm;

    private readonly tools = new Map<string, StructuredToolInterface>([
        [forecastTool.name, forecastTool],
        [recommendOrderTool.name, recommendOrderTool],
        [forecastExplanationTool.name, forecastExplanationTool],
    ]);

    constructor() {
        this.llm = LLMFactory.create().bindTools([
            forecastTool,
            recommendOrderTool,
            forecastExplanationTool,
        ]);
    }

    async ask(question: string) {
        const messages:BaseMessage[] = [
            new HumanMessage(question),
        ];

        // First LLM call
        const aiMessage = await this.llm.invoke(messages);

        // If no tool is needed, return the answer directly.
        if (!aiMessage.tool_calls?.length) {
            return aiMessage.content;
        }

        messages.push(aiMessage);

        const toolCall = aiMessage.tool_calls[0];

        const tool = this.tools.get(toolCall.name);

        if (!tool) {
            throw new Error(`Unknown tool: ${toolCall.name}`);
        }

        let toolResult;

        try {
            toolResult = await tool.invoke(toolCall.args);

            // console.dir(toolResult, {
            //     depth: null,
            // });
        } catch (error) {
            toolResult = {
                error:
                    error instanceof Error
                        ? error.message
                        : "Unknown tool error",
            };
        }
        
        if (!toolCall.id) {
            throw new Error("The model returned a tool call without an ID.");
        }
        
        messages.push(
            new ToolMessage({
                tool_call_id: toolCall.id,
                content: JSON.stringify(toolResult, null, 2),
            }),
        );
        // console.log('messages', messages)
        // Second LLM call
        const finalAnswer = await this.llm.invoke(messages);

        return finalAnswer.content;
    }
}