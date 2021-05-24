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
        "callback_id": "estimation-submitted",
        title: {
          type: "plain_text",
          text: "Ticket Estimation"
        },
        close: {
          type: "plain_text",
          text: "Close"
        },
        "submit": {
          "type": "plain_text",
          "text": "Submit"
        },
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "Please select your estimate and submit",
              "emoji": true
            }
          },
          {
            "type": "divider"
          },
          {
            "type": "input",
            "block_id": "estimation",
            "dispatch_action": false,
            "element": {
              "action_id": "submit",
              "type": "radio_buttons",
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Small"
                  },
                  "value": "S"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Medium"
                  },
                  "value": "M"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Large"
                  },
                  "value": "L"
                }
              ]
            },
            "label": {
              "type": "plain_text",
              "text": shortcut.message.text,
              "emoji": true
            }
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.view('estimation-submitted', async ({ ack, payload, body, view, client }) => {
  // Acknowledge action request

  console.log('estimation', payload);
  
  try {

    await ack();

    await client.chat.postMessage({
      token: client.token,
      channel: "C022N0AGA8M",
      text: `Estimation submitted by ${body.user.name} for ${payload.blocks[2].label.text} of ${view.state.values.estimation.submit.selected_option.value}`
    });

    await client.chat.postMessage({
      token: client.token,
      channel: "C021ZNE8Q5S",
      text: `Estimation submitted by ${body.user.name} for ${payload.blocks[2].label.text}`
    });
  }
  catch (error) {
    console.error(error, error.data.response_metadata);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);

  console.log('Ticket refinement app is running!');
})();
