const { Group, Item, User } = require('../models/schema'); 
const { sendSlackNotification } = require('../utils/slack');

// Item Functions
async function addItemToGroup(groupId, itemData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const item = new Item(itemData);
        await item.save();
        group.items.push(item._id);
        await group.save();
        return item;
    } catch (err) {
        console.error('Error adding item to group:', err);
        throw { error: 'Failed to add item to group', details: err.message };
    }
}

async function addItem(itemData) {
    try {
        const item = new Item(itemData);
        await item.save();
        return {itemId:item._id};
    } catch (err) {
        console.error('Error creating item:', err);
        throw { error: 'Failed to create item ', details: err.message };
    }
}

async function removeItemFromGroup(itemId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            throw new Error('Item not found');
        }
        const group = await Group.findOne({ items: itemId });
        if (!group) {
            throw new Error('Group containing the item not found');
        }
        group.items = group.items.filter((id) => id.toString() !== itemId);
        await group.save();
        await Item.findByIdAndDelete(itemId);
        return group;
    } catch (err) {
        console.error('Error removing item from group:', err);
        throw { error: 'Failed to remove item from group', details: err.message };
    }
}

async function updateItemInGroup(itemData) {
    try {
        const item = await Item.findById(itemData._id);
        if (!item) {
            throw new Error('Item not found');
        }
        const updatedItem = await Item.findByIdAndUpdate(
            itemData._id,
            { $set: itemData },
            { new: true }
        );
        const users = await User.find({ _id: { $in: item.assignedToId } });
        const notificationPromises = users.map((user) => {
            const message = `Hello ${user.fullname},\n\nThe item "${item.itemName}" has been updated.\nPlease check the details and take necessary actions.\n\nThank you!`;
            return sendSlackNotification(user.email, message);
        });
        await Promise.all(notificationPromises);
        return updatedItem;
    } catch (err) {
        console.error('Error updating item in group:', err);
        throw { error: 'Failed to update item in group', details: err.message };
    }
}

async function addMembersToItem(itemId, userId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            throw new Error('Item not found');
        }
        const userAlreadyAssigned = item.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this item');
        }
        item.assignedToId.push(userId);
        const updatedItem = await item.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the item "${item.itemName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        return updatedItem;
    } catch (err) {
        console.error('Error adding members to item:', err);
        throw err;
    }
}

async function removeMembersFromItem(itemId, userId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            throw new Error('Item not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = item.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this item';
        }

        item.assignedToId.splice(userIndex, 1);

        const updatedItem = await item.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the item "${item.itemName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        return updatedItem;
    } catch (err) {
        console.error('Error removing members from item:', err);
        throw err;
    }
}


module.exports = {
    addItemToGroup,
    addItem,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem,
    removeMembersFromItem,
};
