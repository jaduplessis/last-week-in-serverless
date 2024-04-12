import { ChatAnthropic } from "@langchain/anthropic";
import { getEnvVariable } from "@last-week/helpers";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { systemPrompt } from "./system";

interface LLMResponse {
  summary: string;
}

export const invoke = async (content: string): Promise<string> => {
  const model = new ChatAnthropic({
    apiKey: getEnvVariable("ANTHROPIC_API_KEY"),
    model: "claude-3-haiku-20240307",
    temperature: 0.2,
    maxTokens: 1000,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(content),
  ];

  const response = await model.invoke(messages);
  const stringResponse = response.content as string;

  const { summary } = JSON.parse(stringResponse) as LLMResponse;

  return summary;
};
