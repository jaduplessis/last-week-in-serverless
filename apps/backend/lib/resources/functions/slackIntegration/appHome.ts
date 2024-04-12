import { HomeView } from '@slack/bolt';

export const createHome = (): HomeView => {
  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "Introducing the GOAT of serverless updates: 🐐 We're not kidding around when we say it's the ultimate shepherd for all things lamb-das. Sit back, relax, and let our bot herd the latest serverless news straight to your pasture. No more grazing through endless feeds – we've got your back! It's time to stop being sheepish about staying updated and let our bot lead the way",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Press to Impress",
          },
          action_id: "updates",
        },
      ],
    },
  ];

  const view: HomeView = {
    type: 'home',
    callback_id: 'home_view',
    blocks: blocks,
  };

  return view;
};
