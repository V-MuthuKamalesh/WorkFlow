const cron = require('node-cron');
const { Item, User } = require('../models/schema');
const { sendNotification } = require('../utils/notification');

cron.schedule('0 10 * * *', async () => {
  try {
    const items = await Item.find({ dueDate: { $lt: new Date() }, status: { $ne: 'Done' } });
    for (const item of items) {
      const users = await User.find({ _id: { $in: item.assignedToId } });
      const notificationPromises = users.map(async (user) => {
        const message = `\n\nThe item "${item.itemName}" is overdue and its due date has passed.\nPlease check the details and take necessary actions.\n\nThank you!`;
        await sendNotification(user, message);
      });
      await Promise.all(notificationPromises);
    }
  } catch (error) {
    console.error('Error checking items:', error);
  }
});
