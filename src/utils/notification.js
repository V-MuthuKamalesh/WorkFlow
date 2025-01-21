const { sendSlackNotification } = require('../utils/slack');
const { sendEmail } = require('../utils/email');

async function sendNotification(user, message) {
    try {
        await sendSlackNotification(user.email, message);
    } catch (slackError) {
        const emailSubject = `Notification`;
        const emailBody = `
            <div>
                <p>Hello ${user.fullname},</p>
                <p>${message}</p>
                <p>Thank you!</p>
            </div>
        `;
        await sendEmail(user.email, emailSubject, emailBody);
    }
}

module.exports = {
    sendNotification,
}