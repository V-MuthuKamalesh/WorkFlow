const jwt = require('jsonwebtoken');
const workspaceService = require('../services/workspace');
const workService = require('../services/workservice');
const { Module } = require('../models/schema');
const moduleId = "67766a5150a4edf07d7fc25b";

async function getWorkspaces(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id;
        const filterBy = { moduleId, userId };
        const workspaces = await workspaceService.query(filterBy);
        return workspaces;
    } catch (err) {
        console.log('Failed to get workspaces: ' + err.message);
    }
}

async function getWorkspaceById(id) {
    try {
        const workspace = await workspaceService.getById(id);
        console.log(workspace);
        
        if (!workspace) console.log('Workspace not found');
        return workspace;
    } catch (err) {
        console.log('Failed to get workspace: ' + err.message);
    }
}

async function createWorkspace(data) {
    try {
        data.moduleId = moduleId;
        const newWorkspace = await workspaceService.add(data);
        await Module.findByIdAndUpdate(moduleId, { $push: { workspaces: newWorkspace._id } });
        return newWorkspace;
    } catch (err) {
        console.log('Failed to create workspace: ' + err.message);
    }
}

async function updateWorkspace(id, updateData) {
    try {
        const updatedWorkspace = await workspaceService.update(id, updateData);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to update workspace: ' + err.message);
    }
}

async function deleteWorkspace(id) {
    try {
        const workspaceId = await workspaceService.remove(id, moduleId);
        return workspaceId;
    } catch (err) {
        console.log('Failed to delete workspace: ' + err.message);
    }
}

async function addMemberToWorkspace(id, userId, token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const adminId = decoded._id;
        const response = await workspaceService.addMember(id, userId, adminId);
        return response;
    } catch (err) {
        console.log('Failed to add member to workspace: ' + err.message);
    }
}
async function addBoardToWorkspace(id, boardData) {
    try {
        const updatedWorkspace = await workspaceService.addBoard(id, boardData);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to add board to workspace'+ err.message );
    }
}

async function removeBoardFromWorkspace(boardId) {
    try {
        const updatedWorkspace = await workspaceService.removeBoard(boardId);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to remove board from workspace'+err.message );
    }
}

async function updateBoardInWorkspace(boardId, boardData) {
    try {
        const updatedWorkspace = await workspaceService.updateBoard(boardId, boardData);
        return updatedWorkspace;
    } catch (err) {
        console.log('Failed to update board in workspace'+ err.message );
    }
}

async function getBoardById(boardId) {
    try {
        const boardData = await workspaceService.getBoard(boardId);
        return boardData;
    } catch (err) {
        console.error('Error in getBoardById:', err);
    }
}


// Group Functions

async function addGroupToBoard(boardId, groupData) {
    try {
        const updatedBoard = await workspaceService.addGroup(boardId, groupData);
        return updatedBoard;
    } catch (err) {
        console.log('Failed to add group to board'+ err.message );
    }
}

async function removeGroupFromBoard(groupId) {
    try {
        const updatedBoard = await workspaceService.removeGroup(groupId);
        return updatedBoard;
    } catch (err) {
        console.log('Failed to remove group from board'+ err.message );
    }
}

async function updateGroupInBoard(groupId, groupData) {
    try {
        const updatedGroup = await workspaceService.updateGroup(groupId,groupData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to update group in board'+err.message );
    }
}

async function addItemToGroup(groupId, itemData) {
    try {
        const updatedGroup = await workService.addItemToGroup(groupId, itemData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add item to group'+ err.message );
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