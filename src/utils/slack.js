const { WebClient } = require('@slack/web-api');
const User = require('../models/schema'); 

const slackToken = process.env.SLACK_BOT_TOKEN; 
const slackClient = new WebClient(slackToken);

async function sendSlackNotification(email, message) {
    try {
        const user = await slackClient.users.lookupByEmail({ email });
        const slackId = user.user.id;
        await slackClient.chat.postMessage({
            channel: slackId,
            text: message,
        });

        console.log(`Notification sent to ${email}`);
    } catch (error) {
        console.error('Error sending Slack notification:', error.message);
        throw error;
    }
}

module.exports = {
    sendSlackNotification,
};
