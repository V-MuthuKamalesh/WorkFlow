const {  Board, Group, Item, User } = require('../models/schema'); 
const { sendSlackNotification } = require('../utils/slack');

async function getBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'items',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: board._id,
            boardName: board.boardName,
            type: board.type || "",
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.items.map((item) => {
                    const transformedAssignedTo = Array.isArray(item.assignedToId)
                        ? item.assignedToId.map((assigned) => ({
                              userId: assigned._id, 
                              email: assigned.email,
                              fullname: assigned.fullname,
                          }))
                        : null;
                    return {
                        itemId: item._id,
                        itemName: item.itemName,
                        assignedToId: transformedAssignedTo, 
                        status: item.status || "",
                        dueDate: item.dueDate || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}

async function getType(boardId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        return board.type || "";
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


// Group Functions
async function addGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        groupData.items = [itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'items',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            type: populatedBoard.type || "",
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.items.map((item) => ({
                    itemId: item._id,
                    itemName: item.itemName,
                    assignedToId: item.assignedToId,
                    status: item.status || "",
                    dueDate: item.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
        throw { error: 'Failed to add group to board', details: err.message };
    }
}

async function removeGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            throw new Error('Board containing the group not found');
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'items',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: newboard._id,
            boardName: newboard.boardName,
            type: newboard.type || "",
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.items.map((item) => ({
                    itemId: item._id,
                    itemName: item.itemName,
                    assignedToId: item.assignedToId,
                    status: item.status || "",
                    dueDate: item.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
    }
}

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
        const transformedAssignedTo = Array.isArray(item.assignedToId)
            ? item.assignedToId.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        return {itemId:item._id, itemName: item.itemName, assignedToId: transformedAssignedTo, status: item.status || "", dueDate: item.dueDate || "",};
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
        await item.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the item "${item.itemName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await item.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = item.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
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

        await item.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the item "${item.itemName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await item.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = item.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from item:', err);
        throw err;
    }
}


module.exports = {
    getBoard,
    getType,
    addGroup,
    removeGroup,
    addItemToGroup,
    addItem,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem,
    removeMembersFromItem,
};
