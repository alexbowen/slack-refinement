// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

app.action({ 'action_id': 'refinement', type: 'block_actions'}, async ({ ack, client, body }) => {

  try {
    await ack();

    await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        "callback_id": "submit",
        "private_metadata": body.container.message_ts,
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
              "text": "Please select your estimate"
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
                  "value": "Small"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Medium"
                  },
                  "value": "Medium"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "Large"
                  },
                  "value": "Large"
                }
              ]
            },
            "label": {
              "type": "plain_text",
              "text": body.message.text
            }
          },
          {
            "type": "input",
            "block_id": "additional",
            "dispatch_action": false,
            "optional": true,
            "element": {
              "type": "plain_text_input",
              "action_id": "submit",
            },
            "label": {
              "type": "plain_text",
              "text": "Additional information"
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

    console.log(payload, body, view);

    await client.chat.postMessage({
      token: client.token,
      channel: "C022NHC2GUE",
      text: `Estimation submitted by ${body.user.name} for ${payload.blocks[2].label.text} of ${view.state.values.estimation.submit.selected_option.value}\n${view.state.values.additional.submit.value ? view.state.values.additional.submit.value : ''}`
    });

    await client.chat.postMessage({
      token: client.token,
      channel: "C021ZNE8Q5S",
      "thread_ts":  view.private_metadata,
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
