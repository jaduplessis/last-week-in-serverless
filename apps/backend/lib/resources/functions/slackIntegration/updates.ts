import { Block } from "@slack/bolt";
import { DataSourceEntity, ICommentary } from "../../dataModel";

export const getUpdates = async (): Promise<Block[]> => {
  const dataSources = await DataSourceEntity.query("DATA_SOURCE#COMMENTARY");

  if (!dataSources.Items) {
    return [];
  }

  const commentaryItems = dataSources.Items as ICommentary[];

  // Order by ranking
  commentaryItems.sort((a, b) => a.ranking - b.ranking);

  const commentaryBlocks: Block[] = commentaryItems.map((item) => {
    const { title, link, commentary, ranking } = item;

    return {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title}*\n<${link}|Read more>\n${commentary}\n\n`,
      },
    };
  });

  const blocks: Block[] = []
  commentaryBlocks.forEach((block, index) => {
    blocks.push(block);
    if (index < commentaryBlocks.length - 1) {
      blocks.push({
        type: "divider",
      });
    }
  });

  return blocks;
};
