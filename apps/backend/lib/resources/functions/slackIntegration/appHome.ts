import { HomeView } from '@slack/bolt';

export const createHome = (): HomeView => {
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: '*Welcome!* \nThis is a home for the last week in serverless helper.',
      },
    },
    {
      type: 'actions',
      elements: [
        {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click me for the latest updates in Serverless!',
          },
          action_id: 'updates',
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
