const { Group, Item } = require('../models/schema'); 


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
        return group;
    } catch (err) {
        console.error('Error adding item to group:', err);
        throw { error: 'Failed to add item to group', details: err.message };
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
        return updatedItem;
    } catch (err) {
        console.error('Error adding members to item:', err);
        throw err;
    }
}

module.exports = {
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem,
};
