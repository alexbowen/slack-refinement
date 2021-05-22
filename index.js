// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

app.shortcut('refinement', async ({ shortcut, ack, client }) => {

  

  try {
    // Acknowledge shortcut request
    await ack();


    // Call the views.open method using one of the built-in WebClients
    const result = await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: "modal",
        title: {
          type: "plain_text",
          text: "Ticket Estimation"
        },
        close: {
          type: "plain_text",
          text: "Close"
        },
        blocks: [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Please submit your estimation for ticket xyz"
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "radio_buttons",
                "options": [
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Small",
                      "emoji": true
                    },
                    "value": "small"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Medium",
                      "emoji": true
                    },
                    "value": "medium"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Large",
                      "emoji": true
                    },
                    "value": "large"
                  }
                ]
              }
            ]
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit estimation",
                  "emoji": true
                },
                "value": "click_me_123",
                "action_id": "actionId-0"
              }
            ]
          }
        ]
      }
    });

    console.log(result);
  }
  catch (error) {
    console.error(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();
