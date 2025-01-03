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
        const workspace = await workspaceService.getById(id, moduleId);
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
        const updatedWorkspace = await workspaceService.addMember(id, userId, role, moduleId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add member to workspace', details: err.message });
    }
}

async function addBoardToWorkspace(req, res) {
    try {
        const { id } = req.params;
        const boardData = req.body;
        const updatedWorkspace = await workspaceService.addBoard(id, boardData, moduleId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add board to workspace', details: err.message });
    }
}

async function removeBoardFromWorkspace(req, res) {
    try {
        const { workspaceId, boardId } = req.params;
        const updatedWorkspace = await workspaceService.removeBoard(workspaceId, boardId, moduleId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove board from workspace', details: err.message });
    }
}

async function updateBoardInWorkspace(req, res) {
    try {
        const { workspaceId, boardId } = req.params;
        const boardData = req.body; 
        
        const updatedWorkspace = await workspaceService.updateBoard(workspaceId, boardId, boardData,moduleId);

        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update board in workspace', details: err.message });
    }
}


// Group Functions

async function addGroupToBoard(req, res) {
    try {
        const { boardId } = req.params;
        const groupData = req.body;

        const updatedBoard = await workspaceService.addGroup(boardId, groupData, moduleId);
        res.status(200).send(updatedBoard);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add group to board', details: err.message });
    }
}

async function removeGroupFromBoard(req, res) {
    try {
        const { boardId, groupId } = req.params;
        const updatedBoard = await workspaceService.removeGroup(boardId, groupId, moduleId);
        res.status(200).send(updatedBoard);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove group from board', details: err.message });
    }
}

async function updateGroupInBoard(req, res) {
    try {
        const {workspaceId,boardId,groupId}=req.params;
        const groupData = req.body;
        const updatedGroup = await workspaceService.updateGroup(workspaceId,boardId,groupId,groupData, moduleId);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update group in board', details: err.message });
    }
}

async function addItemToGroup(req, res) {
    try {
        const { workspaceId, boardId, groupId } = req.params;
        const itemData = req.body;
        const updatedGroup = await workspaceService.addItemToGroup(workspaceId, boardId, groupId, itemData, moduleId);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add item to group', details: err.message });
    }
}

async function removeItemFromGroup(req, res) {
    try {
        const { groupId, itemId } = req.params;
        const updatedGroup = await workspaceService.removeItemFromGroup(groupId, itemId, moduleId);
        res.status(200).send(updatedGroup);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove item from group', details: err.message });
    }
}

async function updateItemInGroup(req, res) {
    try {
        const itemData = req.body;
        const updatedItem = await workspaceService.updateItemInGroup(itemData, moduleId);
        res.status(200).send(updatedItem);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update item in group', details: err.message });
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
    addGroupToBoard,
    removeGroupFromBoard,
    updateGroupInBoard,
    addItemToGroup,
    removeItemFromGroup,
    updateItemInGroup,
};
