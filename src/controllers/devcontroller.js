const workspaceService = require('../services/workspace');
const devService = require('../services/devservice');
const { Module } = require('../models/schema');
const moduleId = "67766a5150a4edf07d7fc25d";

async function getWorkspaces() {
    try {
        const filterBy = { moduleId };
        const workspaces = await workspaceService.query(filterBy);
        return workspaces;
    } catch (err) {
        console.log('Failed to get workspaces: ' + err.message);
    }
}

async function getWorkspaceById(id) {
    try {
        const workspace = await workspaceService.getById(id);
        if (!workspace) throw new Error('Workspace not found');
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

async function addMemberToWorkspace(id, members) {
    try {
        const updatedWorkspace = await workspaceService.addMember(id, members);
        return updatedWorkspace;
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

//Task
async function addTaskToGroup(groupId, taskData) {
    try {
        const updatedGroup = await devService.addTaskToGroup(groupId, taskData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add task to group'+ err.message );
    }
}

async function removeTaskFromGroup(taskId) {
    try {
        const updatedGroup = await devService.removeTaskFromGroup(taskId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove task from group' + err.message );
    }
}

async function updateTaskInGroup(taskId, taskData) {
    try {
        taskData._id=taskId;
        const updatedTask = await devService.updateTaskInGroup(taskData);
        return updatedTask;
    } catch (err) {
        console.log('Failed to update task in group'+err.message );
    }
}

// Sprint
async function addSprintToGroup(groupId, sprintData) {
    try {
        const updatedGroup = await devService.addSprintToGroup(groupId, sprintData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add sprint to group'+ err.message );
    }
}

async function removeSprintFromGroup(sprintId) {
    try {
        const updatedGroup = await devService.removeSprintFromGroup(sprintId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove sprint from group' + err.message );
    }
}

async function updateSprintInGroup(sprintId, sprintData) {
    try {
        sprintData._id=sprintId;
        const updatedSprint = await devService.updateSprintInGroup(sprintData);
        return updatedSprint;
    } catch (err) {
        console.log('Failed to update sprint in group'+err.message );
    }
}

// Bug
async function addBugToGroup(groupId, bugData) {
    try {
        const updatedGroup = await devService.addBugToGroup(groupId, bugData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add bug to group'+ err.message );
    }
}

async function removeBugFromGroup(bugId) {
    try {
        const updatedGroup = await devService.removeBugFromGroup(bugId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove bug from group' + err.message );
    }
}

async function updateBugInGroup(bugId, bugData) {
    try {
        bugData._id=bugId;
        const updatedBug = await devService.updateBugInGroup(bugData);
        return updatedBug;
    } catch (err) {
        console.log('Failed to update bug in group'+err.message );
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
    addTaskToGroup,
    removeTaskFromGroup,
    updateTaskInGroup,
    addSprintToGroup,
    removeSprintFromGroup,
    updateSprintInGroup,
    addBugToGroup,
    removeBugFromGroup,
    updateBugInGroup,
};