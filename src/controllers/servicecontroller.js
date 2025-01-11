const workspaceService = require('../services/workspace');
const service = require('../services/service');
const { Module } = require('../models/schema');
const moduleId = "67766a5150a4edf07d7fc25e";

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

//Ticket
async function addTicketToGroup(groupId, ticketData) {
    try {
        const updatedGroup = await service.addTicketToGroup(groupId, ticketData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add ticket to group'+ err.message );
    }
}

async function addTicket(ticketData) {
    try {
        const ticket = await workService.addTicket(ticketData);
        return ticket;
    } catch (err) {
        console.log('Failed to create ticket '+ err.message );
    }
}

async function removeTicketFromGroup(ticketId) {
    try {
        const updatedGroup = await service.removeTicketFromGroup(ticketId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove ticket from group' + err.message );
    }
}

async function updateTicketInGroup(ticketId, ticketData) {
    try {
        ticketData._id=ticketId;
        const updatedTicket = await service.updateTicketInGroup(ticketData);
        return updatedTicket;
    } catch (err) {
        console.log('Failed to update ticket in group'+err.message );
    }
}

// Incident
async function addIncidentToGroup(groupId, incidentData) {
    try {
        const updatedGroup = await service.addIncidentToGroup(groupId, incidentData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add incident to group'+ err.message );
    }
}

async function addIncident(incidentData) {
    try {
        const incident = await workService.addIncident(incidentData);
        return incident;
    } catch (err) {
        console.log('Failed to create incident '+ err.message );
    }
}

async function removeIncidentFromGroup(incidentId) {
    try {
        const updatedGroup = await service.removeIncidentFromGroup(incidentId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove incident from group' + err.message );
    }
}

async function updateIncidentInGroup(incidentId, incidentData) {
    try {
        incidentData._id=incidentId;
        const updatedIncident = await service.updateIncidentInGroup(incidentData);
        return updatedIncident;
    } catch (err) {
        console.log('Failed to update incident in group'+err.message );
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
    addTicketToGroup,
    addTicket,
    removeTicketFromGroup,
    updateTicketInGroup,
    addIncidentToGroup,
    addIncident,
    removeIncidentFromGroup,
    updateIncidentInGroup,
};