const workspaceService = require('../services/workspace');

async function getWorkspaces(req, res) {
    try {
        const filterBy = req.query;
        const workspaces = await workspaceService.query(filterBy);
        // console.log(workspaces);
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
        const newWorkspace = await workspaceService.add(workspaceData);
        res.status(201).send(newWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to create workspace', details: err.message });
    }
}

async function updateWorkspace(req, res) {
    try {
        const workspaceData = req.body;
        const workspaceId = req.params.id;
        workspaceData._id = workspaceId;
        const updatedWorkspace = await workspaceService.update(workspaceData);
        // console.log(workspaceData);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update workspace', details: err.message });
    }
}

async function deleteWorkspace(req, res) {
    try {
        const { id } = req.params;
        await workspaceService.remove(id);
        res.status(200).send({ message: 'Workspace deleted successfully' });
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete workspace', details: err.message });
    }
}

async function addMemberToWorkspace(req, res) {
    try {
        const { id } = req.params; 
        const { userId, role } = req.body; 
        // console.log(id, userId);
        if (!userId) {
            return res.status(400).send({ error: 'User ID is required' });
        }
        const updatedWorkspace = await workspaceService .addMember(id, userId, role);
        // console.log(updatedWorkspace);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add member to workspace', details: err.message });
    }
}

async function addBoardToWorkspace(req, res) {
    try {
        const { workspaceId } = req.params;
        const boardData = req.body;
        const updatedWorkspace = await workspaceService.addBoard(workspaceId, boardData);
        res.status(201).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add board to workspace', details: err.message });
    }
}

async function removeBoardFromWorkspace(req, res) {
    try {
        const { workspaceId, boardId } = req.params;
        const updatedWorkspace = await workspaceService.removeBoard(workspaceId, boardId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove board from workspace', details: err.message });
    }
}

async function updateBoardInWorkspace(req, res) {
    try {
        const boardData = req.body;
        const updatedBoard = await workspaceService.updateBoard(boardData);
        res.status(200).send(updatedBoard);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update board', details: err.message });
    }
}

async function addGroupToBoard(req, res) {
    try {
        const { workspaceId, boardId } = req.params;
        const groupData = req.body;
        const updatedWorkspace = await workspaceService.addGroup(workspaceId, boardId, groupData);
        res.status(201).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add group to board', details: err.message });
    }
}

async function removeGroupFromBoard(req, res) {
    try {
        const { workspaceId, boardId, groupId } = req.params;
        const updatedWorkspace = await workspaceService.removeGroup(workspaceId, boardId, groupId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove group from board', details: err.message });
    }
}

async function updateGroupInBoard(req, res) {
    try {
        const { workspaceId, boardId } = req.params;
        const groupData = req.body;
        const updatedWorkspace = await workspaceService.updateGroup(workspaceId, boardId, groupData);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to update group in board', details: err.message });
    }
}

async function addItemToGroup(req, res) {
    try {
        const { workspaceId, boardId, groupId } = req.params;
        const itemData = req.body;
        const updatedWorkspace = await workspaceService.addItemToGroup(workspaceId, boardId, groupId, itemData);
        res.status(201).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to add item to group', details: err.message });
    }
}

async function removeItemFromGroup(req, res) {
    try {
        const { workspaceId, boardId, groupId, itemId } = req.params;
        const updatedWorkspace = await workspaceService.removeItemFromGroup(workspaceId, boardId, groupId, itemId);
        res.status(200).send(updatedWorkspace);
    } catch (err) {
        res.status(500).send({ error: 'Failed to remove item from group', details: err.message });
    }
}

async function updateItemInGroup(req, res) {
    try {
        const { workspaceId, boardId, groupId } = req.params;
        const itemData = req.body;
        const updatedWorkspace = await workspaceService.updateItemInGroup(workspaceId, boardId, groupId, itemData);
        res.status(200).send(updatedWorkspace);
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
