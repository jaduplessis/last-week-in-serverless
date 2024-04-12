import { ChatAnthropic } from "@langchain/anthropic";
import { getEnvVariable } from "@last-week/helpers";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { systemPrompt } from "./system";

interface LLMResponse {
  commentary: string;
}

export const invoke = async (content: string): Promise<string> => {
  const model = new ChatAnthropic({
    apiKey: getEnvVariable("ANTHROPIC_API_KEY"),
    model: "claude-3-haiku-20240307",
    temperature: 1,
    maxTokens: 1000,
  });

  const messages: (HumanMessage | SystemMessage)[] = [
    new SystemMessage(systemPrompt),
    new HumanMessage(content),
  ];

  const response = await model.invoke(messages);
  const stringResponse = response.content as string;

  const { commentary } = JSON.parse(stringResponse) as LLMResponse;

  return commentary;
};
