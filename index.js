// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

app.shortcut('refinement', async ({ shortcut, ack, client }) => {

  try {
    await ack();

    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: "modal",
        "callback_id": "submit",
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
              "text": "Please select your estimate and submit"
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
              "text": shortcut.message.text
            }
          },
          {
            "type": "input",
            "element": {
              "type": "plain_text_input",
              "block_id": "additional",
              "dispatch_action": false,
            },
            "label": {
              "type": "plain_text",
              "text": "Additional information (optional)"
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

app.view('submit', async ({ ack, payload, body, view, client }) => {
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
