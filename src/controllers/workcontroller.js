const workService = require('../services/workservice');

async function addItemToGroup(groupId, itemData) {
    try {
        const updatedGroup = await workService.addItemToGroup(groupId, itemData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add item to group'+ err.message );
    }
}

async function addItem(itemData) {
    try {
        const item = await workService.addItem(itemData);
        return item;
    } catch (err) {
        console.log('Failed to create item '+ err.message );
    }
}

async function removeItemFromGroup(itemId) {
    try {
        const updatedGroup = await workService.removeItemFromGroup(itemId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove item from group' + err.message );
    }
}

async function updateItemInGroup(itemId, itemData) {
    try {
        itemData._id=itemId;
        const updatedItem = await workService.updateItemInGroup(itemData);
        return updatedItem;
    } catch (err) {
        console.log('Failed to update item in group'+err.message );
    }
}

async function addMembersToItem(itemId, userId) {
    try {
        const updatedItem = await workService.addMembersToItem(itemId, userId);
        return updatedItem;
    } catch (err) {
        console.log('Failed to add members to item'+err.message);
    }
}

async function removeMembersFromItem(itemId, userId) {
    try {
        const updatedItem = await workService.removeMembersFromItem(itemId, userId);
        return updatedItem;
    } catch (err) {
        console.log('Failed to remove members from item: ' + err.message);
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