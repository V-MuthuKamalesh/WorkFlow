const { Module, Workspace, Board, Group, Item, User } = require('../models/schema'); 

async function query(filterBy) {
    try {
        if (filterBy.moduleId) {
            const module = await Module.findById(filterBy.moduleId).populate({
                path: 'workspaces',
                select: 'workspaceName', 
            });
            if (!module) {
                throw new Error('Module not found');
            }
            const transformedWorkspaces = module.workspaces.map((workspace) => {
                const { _id, workspaceName } = workspace.toObject(); 
                return { workspaceId: _id, workspaceName };
            });
            return transformedWorkspaces;
        } else {
            throw new Error('Module ID is required to fetch workspaces');
        }
    } catch (err) {
        console.error('Error fetching workspaces:', err);
        throw err;
    }
}

async function getById(workspaceId) {
    try {
        const detailedWorkspace = await Workspace.findById(workspaceId)
            .populate({
                path: 'boards',
                select: 'boardName', 
            });
        if (!detailedWorkspace) {
            throw new Error('Workspace not found');
        }
        const transformedBoards = detailedWorkspace.boards.map(board => {
            const { _id, boardName } = board.toObject();
            return { boardId: _id, boardName };
        });
        return { workspaceName: detailedWorkspace.workspaceName, boards: transformedBoards }; 
    } catch (err) {
        console.error('Error fetching workspace by ID:', err);
        throw err;
    }
}

async function add(workspaceData) {
    try {
        const workspace = new Workspace(workspaceData);
        await workspace.save();
        return workspace;
    } catch (err) {
        throw err;
    }
}

async function update(workspaceData) {
    try {
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceData._id,
            { $set: workspaceData },
            { new: true }
        );
        return updatedWorkspace;
    } catch (err) {
        throw err;
    }
}

async function remove(workspaceId, moduleId) {
    try {
        await Workspace.findOneAndDelete({ _id: workspaceId, moduleId });
        return workspaceId;
    } catch (err) {
        throw err;
    }
}

async function addMember(workspaceId, userId, role = 'member') {
    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        const isAlreadyMember = workspace.members.some(
            member => member.userId.toString() === userId
        );
        if (isAlreadyMember) {
            throw new Error('User is already a member of this workspace');
        }
        workspace.members.push({ userId, role });
        const updatedWorkspace = await workspace.save();
        return updatedWorkspace;
    } catch (err) {
        console.error('Error adding member to workspace:', err);
        throw err;
    }
}


// Board Functions
async function addBoard(workspaceId, boardData) {
    try {
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }
        boardData.workspaceName = workspace.workspaceName;
        const board = new Board(boardData);
        await board.save();
        workspace.boards.push(board._id);
        const updatedWorkspace = await workspace.save();
        return updatedWorkspace;
    } catch (err) {
        console.error('Error adding board to workspace:', err);
        throw err;
    }
}

async function removeBoard(boardId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        const workspace = await Workspace.findOne({ boards: boardId });
        if (!workspace) {
            throw new Error('Workspace not found for the specified board');
        }
        workspace.boards = workspace.boards.filter(
            (id) => id.toString() !== boardId
        );
        await workspace.save();
        await Board.findByIdAndDelete(boardId);
        return workspace;
    } catch (err) {
        console.error('Error removing board:', err);
        throw err;
    }
}


async function updateBoard(boardId, boardData) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            { $set: boardData },
            { new: true }
        );
        return updatedBoard;
    } catch (err) {
        console.error('Error updating board:', err);
        throw { error: 'Failed to update board', details: err.message };
    }
}


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
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.items.map((item) => ({
                    itemName: item.itemName,
                    assignedToId: item.assignedToId,
                    status: item.status || "",
                    dueDate: item.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}

// Group Functions
async function addGroup(boardId, groupData) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        return board;
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
        return board;
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
    }
}

async function updateGroup(groupId, groupData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const updatedGroup = await Group.findByIdAndUpdate(
            groupId,
            { $set: groupData },
            { new: true } 
        );
        return updatedGroup;
    } catch (err) {
        console.error('Error updating group:', err);
        throw { error: 'Failed to update group', details: err.message };
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
    query,
    getById,
    add,
    update,
    remove,
    addMember,
    addBoard,
    removeBoard,
    updateBoard,
    getBoard,
    addGroup,
    removeGroup,
    updateGroup,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem
};
