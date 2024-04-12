import { App, AwsLambdaReceiver } from "@slack/bolt";
import { APIGatewayProxyHandler } from "aws-lambda";

import { getEnvVariable } from "@last-week/helpers";

import { createHome } from "./appHome";
import { getUpdates } from "./updates";

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback
) => {
  const SLACK_SIGNING_SECRET = getEnvVariable("SLACK_SIGNING_SECRET");
  const SLACK_BOT_TOKEN = getEnvVariable("SLACK_BOT_TOKEN");

  const awsLambdaReceiver = new AwsLambdaReceiver({
    signingSecret: SLACK_SIGNING_SECRET,
  });

  const app = new App({
    token: SLACK_BOT_TOKEN,
    receiver: awsLambdaReceiver,
  });

  app.event(
    "app_home_opened",
    async ({ event: home_event, context: home_context }) => {
      const homeView = createHome();

      try {
        await app.client.views.publish({
          token: home_context.botToken,
          user_id: home_event.user,
          view: homeView,
        });
      } catch (e) {
        console.error(e);
      }
    }
  );

  // Update handler
  app.action("updates", async ({ ack, body, context }) => {
    await ack();

    const blockUpdates = await getUpdates();

    try {
      await app.client.chat.postMessage({
        token: context.botToken,
        channel: body.user.id,
        blocks: blockUpdates,
      });
    } catch (e) {
      console.error(e);
    }
  });

  const response = await awsLambdaReceiver.start();

  return response(event, context, callback);
};
