const { Module, Workspace, Board, Group, Item, User } = require('../models/schema'); 
const mongoose = require('mongoose');

async function query(filterBy) {
    try {
        if (filterBy.moduleId) {
            const module = await Module.findById(filterBy.moduleId).populate('workspaces');
            if (!module) {
                throw new Error('Module not found');
            }
            const workspaceIds = module.workspaces.map(workspace => workspace._id);
            const workspaces = await Workspace.find({ _id: { $in: workspaceIds } })
                .populate('createdBy members.userId boards');
            
            return workspaces;
        } else {
            throw new Error('Module ID is required to fetch workspaces');
        }
    } catch (err) {
        console.error("Error fetching workspaces:", err);
        throw err;
    }
}

async function getById(workspaceId, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }
        const workspace = module.workspaces.find(
            (workspace) => workspace._id.toString() === workspaceId
        );

        if (!workspace) {
            throw new Error('Workspace not found in the specified module');
        }
        const detailedWorkspace = await Workspace.findById(workspaceId)
            .populate('createdBy members.userId boards');

        return detailedWorkspace;
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

async function addMember(workspaceId, userId, role = 'member', moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

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
async function addBoard(workspaceId, boardData, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

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


async function removeBoard(workspaceId, boardId, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        await Board.findByIdAndDelete(boardId);

        workspace.boards = workspace.boards.filter(board => board.toString() !== boardId);
        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error removing board from workspace:', err);
        throw err;
    }
}
async function updateBoard(workspaceId, boardId, boardData, moduleId) {
    try {
        const module = await Module.findById(moduleId).populate('workspaces');
        if (!module) {
            throw new Error('Module not found');
        }

        const workspaceExists = module.workspaces.some(
            workspace => workspace._id.toString() === workspaceId
        );
        if (!workspaceExists) {
            throw new Error('Workspace does not belong to the specified module');
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new Error('Workspace not found');
        }

        const boardIndex = workspace.boards.findIndex(board => board.toString() === boardId);
        if (boardIndex === -1) {
            throw new Error('Board not found in the specified workspace');
        }

        const updatedBoard = await Board.findByIdAndUpdate(
            boardId,
            { $set: boardData },  
            { new: true }
        );

        workspace.boards[boardIndex] = updatedBoard._id;

        const updatedWorkspace = await workspace.save();

        return updatedWorkspace;
    } catch (err) {
        console.error('Error updating board in workspace:', err);
        throw { error: 'Failed to update board in workspace', details: err.message };
    }
}

// Group Functions
async function addGroup(boardId, groupData, moduleId) {
    try {
        const group = new Group(groupData);
        await group.save();

        const board = await Board.findById(boardId);
        board.groups.push(group._id);
        await board.save();

        return board;
    } catch (err) {
        throw err;
    }
}

async function removeGroup(boardId, groupId, moduleId) {
    try {
        await Group.findByIdAndDelete(groupId);

        const board = await Board.findById(boardId);
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();

        return board;
    } catch (err) {
        throw err;
    }
}

async function updateGroup(groupData, moduleId) {
    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            groupData._id,
            { $set: groupData },
            { new: true }
        );
        return updatedGroup;
    } catch (err) {
        throw err;
    }
}

// Item Functions
async function addItemToGroup(groupId, itemData, moduleId) {
    try {
        const item = new Item(itemData);
        await item.save();

        const group = await Group.findById(groupId);
        group.items.push(item._id);
        await group.save();

        return group;
    } catch (err) {
        throw err;
    }
}

async function removeItemFromGroup(groupId, itemId, moduleId) {
    try {
        await Item.findByIdAndDelete(itemId);

        const group = await Group.findById(groupId);
        group.items = group.items.filter(item => item.toString() !== itemId);
        await group.save();

        return group;
    } catch (err) {
        throw err;
    }
}

async function updateItemInGroup(itemData, moduleId) {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            itemData._id,
            { $set: itemData },
            { new: true }
        );
        return updatedItem;
    } catch (err) {
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
    addGroup,
    removeGroup,
    updateGroup,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
};
