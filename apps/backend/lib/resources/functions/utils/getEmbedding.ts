import { OpenAIEmbeddings } from "@langchain/openai";
import { getEnvVariable } from "@last-week/helpers";

export const getEmbedding = async (text: string): Promise<number[]> => {
  const openai = new OpenAIEmbeddings({
    openAIApiKey: getEnvVariable("OPENAI_API_KEY"),
  });
  const embeddings = await openai.embedDocuments([text]);

  return embeddings[0];
};
