const {  Module, Workspace, Board, Group, Item, User } = require('../models/schema'); 
const { sendNotification } = require('../utils/notification');

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
            console.log('Board not found');
        }
        // console.log("Populated board",board);
        
        return {
            boardId: board._id,
            boardName: board.boardName,
            type: board.type || "",
            workspaceName: board.workspaceName,
            workspaceId: board.workspaceId,
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
                        : [];
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
    }
}

async function getType(boardId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        return board.type || "";
    } catch (err) {
        console.error('Error fetching board:', err);
    }
}


// Group Functions
async function addGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
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
    }
}

async function removeGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const item of group.items) {
            await removeItemFromGroup(item._id);
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
            console.log('Board not found');
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
    }
}

// Item Functions
async function addItemToGroup(groupId, itemData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
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
    }
}

async function addItem(itemData) {
    try {
        const item = new Item(itemData);
        await item.save();
        return {itemId:item._id};
    } catch (err) {
        console.error('Error creating item:', err);
    }
}

async function removeItemFromGroup(itemId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            console.log('Item not found');
        }
        let group = await Group.findOne({ items: itemId });
        if (!group) {
            console.log('Group containing the item not found');
        }
        group.items = group.items.filter((id) => id.toString() !== itemId);
        await group.save();
        await Item.findByIdAndDelete(itemId);
        group = await Group.findById(group._id).populate({
            path: 'items',
            populate: {
                path: 'assignedToId',
                select: '_id email fullname',
            },
        });
        console.log("Item deleted");
        return {
            groupId: group._id,
            groupName: group.groupName,
            items: group.items.map((item) => {
                const transformedAssignedTo = Array.isArray(item.assignedToId)
                    ? item.assignedToId.map((assigned) => ({
                          userId: assigned._id, 
                          email: assigned.email,
                          fullname: assigned.fullname,
                      }))
                    : [];
                return {
                    itemId: item._id,
                    itemName: item.itemName,
                    assignedToId: transformedAssignedTo,
                    status: item.status || "",
                    dueDate: item.dueDate || "",
                };
            }),
        };
    } catch (err) {
        console.error('Error removing item from group:', err);
    }
}

async function updateItemInGroup(itemData, boardId, userId) {
    try {
        const item = await Item.findById(itemData._id);
        if (!item) {
            console.log('Item not found');
        }
        const isAssigned = item.assignedToId.some(assignedTo => assignedTo.toString() === userId);
        
        const workspace = await Workspace.findOne({ boards: boardId });
        const isAdmin = workspace.members.some(member => 
            member.userId.toString() === userId.toString() && member.role === 'admin'
          );

        if (!isAssigned  && !isAdmin) {
            console.log('Permission denied: User cannot update this bug');
            return null;
        }
        itemData = {
            ...itemData,
            assignedToId: itemData.assignedToId.map(user => user.userId),
        };
        const updatedItem = await Item.findByIdAndUpdate(
            itemData._id,
            { $set: itemData },
            { new: true }
        );
        const person = await User.findById(userId);
        const users = await User.find({ _id: { $in: item.assignedToId } });
        const notificationPromises = users.map(async (user) => {
            const message = `${person.fullname} has updated the work "${item.itemName}". Please review the updates.`;
            await sendNotification(user, message);
        });
        await Promise.all(notificationPromises);
        return updatedItem;
    } catch (err) {
        console.error('Error updating item in group:', err);
    }
}

async function addMembersToItem(itemId, userId, adminId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            console.log('Item not found');
        }
        const userAlreadyAssigned = item.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this item');
        }else{
            item.assignedToId.push(userId);
            await item.save();
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
            }
            const person = await User.findById(adminId);
            const message = `\n\nYou have been assigned to the work "${item.itemName}" by "${person.fullname}". Please check the details and take necessary actions.\n\nThank you!`;
            await sendNotification(user, message);
        }
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
    }
}

async function removeMembersFromItem(itemId, userId, adminId) {
    try {
        const item = await Item.findById(itemId);
        if (!item) {
            console.log('Item not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = item.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this item';
        }

        item.assignedToId.splice(userIndex, 1);

        await item.save();
        const person = await User.findById(adminId);
        const message = `\n\nYou have been removed from the work "${item.itemName} by ${person.fullname}".\n\nThank you!`;
        await sendNotification(user, message);

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
    }
}

async function getWorkspacesWithItemCounts(moduleId, userId, workspaceId) {
    try {
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: [
                {
                    path: 'members',
                    select: '_id',
                },
                {
                    path: 'boards',
                    populate: {
                        path: 'groups',
                        populate: {
                            path: 'items',
                            populate: {
                                path: 'assignedToId',
                                select: '_id',
                            },
                        },
                    },
                },
            ],
        });
        if (!module) {
            console.log('Module not found');
        }
        const filteredWorkspaces = module.workspaces.filter((workspace) =>
            workspace.members.some(member => member.userId.toString() === userId)
        );
        // console.log(filteredWorkspaces);
        const relevantWorkspaces = workspaceId
            ? filteredWorkspaces.filter(workspace => workspace._id.toString() === workspaceId)
            : filteredWorkspaces;

        const workspaceData = relevantWorkspaces.map((workspace) => {
            let totalTasks = 0;
            let completedTasks = 0;
            let inProgressTasks = 0;
            let pendingTasks = 0;
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.items.forEach((item) => {
                        const isAssignedToMatch = item.assignedToId.some(
                            (assigned) => assigned._id.toString() === userId
                        );
                        if (isAssignedToMatch) {
                            totalTasks++;
                            if (item.status === 'Done') {
                                completedTasks++;
                            } else if (item.status === 'In Progress') {
                                inProgressTasks++;
                            } else {
                                pendingTasks++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
            };
        });
        return {type:"work-management",itemStats:workspaceData};
    } catch (err) {
        console.error('Error fetching workspaces with item counts:', err);
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
    getWorkspacesWithItemCounts,
};
