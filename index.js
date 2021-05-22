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
              "text": `You are submitting an estimation for:\n\n${shortcut.message.text}`
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
                      "text": "Small"
                    },
                    "value": "small"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Medium"
                    },
                    "value": "medium"
                  },
                  {
                    "text": {
                      "type": "plain_text",
                      "text": "Large"
                    },
                    "value": "large"
                  }
                ]
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "Submit your estimate"
                },
                "value": shortcut.user.id,
                "action_id": "submit"
              }
            ]
          }
        ]
      }
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.action('submit', async ({ ack, payload, context }) => {
  // Acknowledge action request

  console.log('submit', payload, context);
  
  try {

    await ack();

    await app.client.chat.postMessage({
      token: context.botToken,
      // Channel to send message to
      channel: payload.channel_id,
      // Include a button in the message (or whatever blocks you want!)

      // Text in the notification
      text: 'Estimation submitted'
    });
  }
  catch (error) {
    console.error(error);
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
