// This example shows how to listen to a button click
// It uses slash commands and actions
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.BOT_TOKEN,
  signingSecret: process.env.SIGNING_SECRET
});

app.shortcut('refinement', async ({ shortcut, ack, client }) => {

  console.log('shortcut', shortcut);

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
              "text": `Please submit an estimation for:\n\n${shortcut.message.text}`,
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

  console.log('estimation', view.state.values.estimation.submit.selected_option.value);
  console.log('body', body, body.channel);
  console.log('bot token', client.token);
  
  try {

    await ack();

    const result = await client.chat.postMessage({
      token: client.token,
      // Channel to send message to
      channel: "C022N0AGA8M",
      // Include a button in the message (or whatever blocks you want!)

      // Text in the notification
      text: `Estimation submitted by ${body.user.name} of ${view.state.values.estimation.submit.selected_option.value}`
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


// app.command('/estimate', async ({ ack, payload, context }) => {
//   // Acknowledge the command request
//   ack();

//   console.log('estimate command');

//   try {
//     const result = await app.client.chat.postMessage({
//       token: context.botToken,
//       // Channel to send message to
//       channel: payload.channel_id,
//       // Include a button in the message (or whatever blocks you want!)
//       blocks: [
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: 'Go ahead. Click it.'
//           },
//           accessory: {
//             type: 'button',
//             text: {
//               type: 'plain_text',
//               text: 'Click me!'
//             },
//             action_id: 'button_abc'
//           }
//         }
//       ],
//       // Text in the notification
//       text: 'Message from Test App'
//     });
//     console.log(result);
//   }
//   catch (error) {
//     console.error(error);
//   }
// });

// // Listen for a button invocation with action_id `button_abc`
// // You must set up a Request URL under Interactive Components on your app configuration page
// app.action('estimate', async ({ ack, body, context }) => {
//   // Acknowledge the button request
//   ack();

//   console.log('estimate action');

//   try {
//     // Update the message
//     const result = await app.client.chat.update({
//       token: context.botToken,
//       // ts of message to update
//       ts: body.message.ts,
//       // Channel of message
//       channel: body.channel.id,
//       blocks: [
//         {
//           type: 'section',
//           text: {
//             type: 'mrkdwn',
//             text: '*The button was clicked!*'
//           }
//         }
//       ],
//       text: 'Message from Test App'
//     });
//     console.log(result);
//   }
//   catch (error) {
//     console.error(error);
//   }
// });
