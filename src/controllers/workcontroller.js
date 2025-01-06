const workspaceService = require('../services/workspace');
const { Module } = require('../models/schema');
const moduleId = "67766a5150a4edf07d7fc25b";

async function getWorkspaces() {
    try {
        const filterBy = { moduleId };
        const workspaces = await workspaceService.query(filterBy);
        return workspaces;
    } catch (err) {
        throw new Error('Failed to get workspaces: ' + err.message);
    }
}

async function getWorkspaceById(id) {
    try {
        const workspace = await workspaceService.getById(id);
        if (!workspace) throw new Error('Workspace not found');
        return workspace;
    } catch (err) {
        throw new Error('Failed to get workspace: ' + err.message);
    }
}

async function createWorkspace(data) {
    try {
        data.moduleId = moduleId;
        const newWorkspace = await workspaceService.add(data);
        await Module.findByIdAndUpdate(moduleId, { $push: { workspaces: newWorkspace._id } });
        return newWorkspace;
    } catch (err) {
        throw new Error('Failed to create workspace: ' + err.message);
    }
}

async function updateWorkspace(id, updateData) {
    try {
        const updatedWorkspace = await workspaceService.update(id, updateData);
        return updatedWorkspace;
    } catch (err) {
        throw new Error('Failed to update workspace: ' + err.message);
    }
}

async function deleteWorkspace(id) {
    try {
        await workspaceService.remove(id, moduleId);
        return { message: 'Workspace deleted successfully' };
    } catch (err) {
        throw new Error('Failed to delete workspace: ' + err.message);
    }
}

async function addMemberToWorkspace(id, members) {
    try {
        const updatedWorkspace = await workspaceService.addMember(id, members);
        return updatedWorkspace;
    } catch (err) {
        throw new Error('Failed to add member to workspace: ' + err.message);
    }
}
async function addBoardToWorkspace(id, boardData) {
    try {
        const updatedWorkspace = await workspaceService.addBoard(id, boardData);
        return updatedWorkspace;
    } catch (err) {
        throw new Error('Failed to add board to workspace'+ err.message );
    }
}

async function removeBoardFromWorkspace(boardId) {
    try {
        const updatedWorkspace = await workspaceService.removeBoard(boardId);
        return updatedWorkspace;
    } catch (err) {
        throw new Error('Failed to remove board from workspace'+err.message );
    }
}

async function updateBoardInWorkspace(boardId, boardData) {
    try {
        const updatedWorkspace = await workspaceService.updateBoard(boardId, boardData);
        return updatedWorkspace;
    } catch (err) {
        throw new Error('Failed to update board in workspace'+ err.message );
    }
}

async function getBoardById(boardId) {
    try {
        const boardData = await workspaceService.getBoard(boardId);
        return boardData;
    } catch (err) {
        console.error('Error in getBoardById:', err);
        throw new Error(err);
    }
}


// Group Functions

async function addGroupToBoard(boardId, groupData) {
    try {
        const updatedBoard = await workspaceService.addGroup(boardId, groupData);
        return updatedBoard;
    } catch (err) {
        throw new Error('Failed to add group to board'+ err.message );
    }
}

async function removeGroupFromBoard(groupId) {
    try {
        const updatedBoard = await workspaceService.removeGroup(groupId);
        return updatedBoard;
    } catch (err) {
        throw new Error('Failed to remove group from board'+ err.message );
    }
}

async function updateGroupInBoard(groupId, groupData) {
    try {
        const updatedGroup = await workspaceService.updateGroup(groupId,groupData);
        return updatedGroup;
    } catch (err) {
        throw new Error('Failed to update group in board'+err.message );
    }
}

async function addItemToGroup(groupId, itemData) {
    try {
        const updatedGroup = await workspaceService.addItemToGroup(groupId, itemData);
        return updatedGroup;
    } catch (err) {
        throw new Error('Failed to add item to group'+ err.message );
    }
}

async function removeItemFromGroup(itemId) {
    try {
        const updatedGroup = await workspaceService.removeItemFromGroup(itemId);
        return updatedGroup;
    } catch (err) {
        throw new Error('Failed to remove item from group' + err.message );
    }
}

async function updateItemInGroup(itemId, itemData) {
    try {
        itemData._id=itemId;
        const updatedItem = await workspaceService.updateItemInGroup(itemData);
        return updatedItem;
    } catch (err) {
        throw new Error('Failed to update item in group'+err.message );
    }
}

async function addMembersToItem(itemId, userId) {
    try {
        const updatedItem = await workspaceService.addMembersToItem(itemId, userId);
        return updatedItem;
    } catch (err) {
        throw new Error('Failed to add members to item'+err.message);
    }
}

module.exports = {
    getWorkspaces,
    getWorkspaceById,
    createWorkspace,
    updateWorkspace,
    addMemberToWorkspace,
    deleteWorkspace,
    addBoardToWorkspace,
    removeBoardFromWorkspace,
    updateBoardInWorkspace,
    getBoardById,
    addGroupToBoard,
    removeGroupFromBoard,
    updateGroupInBoard,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
    addMembersToItem
};