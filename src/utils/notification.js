const { sendSlackNotification } = require('../utils/slack');
const { sendEmail } = require('../utils/email');
const { User } = require('../models/schema');

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
    } finally {
        try {
            await User.updateOne(
                { _id: user._id },
                {
                    $push: {
                        notifications: {
                            $each: [
                                {
                                    message: message,
                                    status: 'Unread',
                                },
                            ],
                            $position: 0,
                        },
                    },
                }
            );
            // console.log("Notification pushed to user");
        } catch (dbError) {
            console.error('Error updating user notifications:', dbError);
        }
    }
}

module.exports = {
    sendNotification,
}