const workspaceService = require('../services/workspace');
const { Module } = require('../models/schema'); 
const  moduleId  = "67766a5150a4edf07d7fc25b";
async function getWorkspaces(req, res) {
    try {
        const filterBy = {};
        filterBy.moduleId = moduleId;  
        const workspaces = await workspaceService.query(filterBy);
        res.status(200).send(workspaces);
    } catch (err) {
        res.status(500).send({ error: 'Failed to get workspaces', details: err.message });
    }
}

async function getWorkspaceById(req, res) {
    try {
        const { id } = req.params;
        const workspace = await workspaceService.getById(id);
        if (!workspace) return res.status(404).send({ error: 'Workspace not found' });
        res.status(200).send(workspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to get workspace', details: err.message });
    }
}

async function createWorkspace(req, res) {
    try {
        const workspaceData = req.body;
        workspaceData.moduleId = moduleId;
        const newWorkspace = await workspaceService.add(workspaceData);
        await Module.findByIdAndUpdate(
            moduleId,
            { $push: { workspaces: newWorkspace._id } }, 
            { new: true } 
        );
        res.status(201).send(newWorkspace);
    } catch (err) {
        console.error("Error creating workspace:", err);
        res.status(500).send({ error: 'Failed to create workspace', details: err.message });
    }
}

async function updateWorkspace(req, res) {
    try {
        const workspaceData = req.body;
        const workspaceId = req.params.id;
        workspaceData._id = workspaceId;
        workspaceData.moduleId = moduleId;  
        const updatedWorkspace = await workspaceService.update(workspaceData);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update workspace', details: err.message });
    }
}

async function deleteWorkspace(req, res) {
    try {
        const { id } = req.params;
        await workspaceService.remove(id, moduleId);
        res.status(200).send({ message: 'Workspace deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete workspace', details: err.message });
    }
}

async function addMemberToWorkspace(req, res) {
    try {
        const { id } = req.params;
        const { userId, role } = req.body;
        const updatedWorkspace = await workspaceService.addMember(id, userId, role);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add member to workspace', details: err.message });
    }
}

async function addBoardToWorkspace(req, res) {
    try {
        const { id } = req.params;
        const boardData = req.body;
        const updatedWorkspace = await workspaceService.addBoard(id, boardData);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add board to workspace', details: err.message });
    }
}

async function removeBoardFromWorkspace(req, res) {
    try {
        const { boardId } = req.params;
        const updatedWorkspace = await workspaceService.removeBoard(boardId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove board from workspace', details: err.message });
    }
}

async function updateBoardInWorkspace(req, res) {
    try {
        const {boardId } = req.params;
        const boardData = req.body; 
        
        const updatedWorkspace = await workspaceService.updateBoard(boardId, boardData);

        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update board in workspace', details: err.message });
    }
}

async function getBoardById(req, res) {
    try {
        const { boardId } = req.params;
        const boardData = await workspaceService.getBoard(boardId);
        res.status(200).send(boardData);
    } catch (err) {
        console.error('Error in getBoardById:', err);
        res.status(500).send(err);
    }
}


// Group Functions

async function addGroupToBoard(req, res) {
    try {
        const { boardId } = req.params;
        const groupData = req.body;
        const updatedBoard = await workspaceService.addGroup(boardId, groupData);
        res.status(200).send(updatedBoard);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add group to board', details: err.message });
    }
}

async function removeGroupFromBoard(req, res) {
    try {
        const { groupId } = req.params;
        const updatedBoard = await workspaceService.removeGroup(groupId);
        res.status(200).send(updatedBoard);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove group from board', details: err.message });
    }
}

async function updateGroupInBoard(req, res) {
    try {
        const {groupId}=req.params;
        const groupData = req.body;
        const updatedGroup = await workspaceService.updateGroup(groupId,groupData);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update group in board', details: err.message });
    }
}

async function addItemToGroup(req, res) {
    try {
        const { groupId } = req.params;
        const itemData = req.body;
        const updatedGroup = await workspaceService.addItemToGroup(groupId, itemData);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add item to group', details: err.message });
    }
}

async function removeItemFromGroup(req, res) {
    try {
        const {itemId } = req.params;
        const updatedGroup = await workspaceService.removeItemFromGroup(itemId);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove item from group', details: err.message });
    }
}

async function updateItemInGroup(req, res) {
    try {
        const { itemId } = req.params;
        const itemData = req.body;
        itemData._id=itemId;
        const updatedItem = await workspaceService.updateItemInGroup(itemData);
        res.status(200).send(updatedItem);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update item in group', details: err.message });
    }
}

async function addMembersToItem(req, res) {
    try {
        const { itemId } = req.params;
        const { userId } = req.body;
        const updatedItem = await workspaceService.addMembersToItem(itemId, userId);
        res.status(200).send(updatedItem);
    } catch (err) {
        res.status(500).send({error: 'Failed to add members to item',details: err.message});
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
