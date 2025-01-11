const workspaceService = require('../services/workspace');
const service = require('../services/service');
const { Module } = require('../models/schema');
const moduleId = "67766a5150a4edf07d7fc25c";

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

//Lead
async function addLeadToGroup(groupId, leadData) {
    try {
        const updatedGroup = await service.addLeadToGroup(groupId, leadData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add lead to group'+ err.message );
    }
}

async function addLead(leadData) {
    try {
        const lead = await workService.addLead(leadData);
        return lead;
    } catch (err) {
        console.log('Failed to create lead '+ err.message );
    }
}

async function removeLeadFromGroup(teadId) {
    try {
        const updatedGroup = await service.removeLeadFromGroup(leadId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove lead from group' + err.message );
    }
}

async function updateLeadInGroup(teadId, teadData) {
    try {
        lengtheadData._id=leadId;
        const updatedLead = await service.updateLeadInGroup(leadData);
        return updatedLead;
    } catch (err) {
        console.log('Failed to update lead in group'+err.message );
    }
}

// Contact
async function addContactToGroup(groupId, contactData) {
    try {
        const updatedGroup = await service.addContactToGroup(groupId, contactData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add contact to group'+ err.message );
    }
}

async function addContact(contactData) {
    try {
        const contact = await workService.addContact(contactData);
        return contact;
    } catch (err) {
        console.log('Failed to create contact '+ err.message );
    }
}

async function removeContactFromGroup(contactId) {
    try {
        const updatedGroup = await service.removeContactFromGroup(contactId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove contact from group' + err.message );
    }
}

async function updateContactInGroup(contactId, contactData) {
    try {
        contactData._id=contactId;
        const updatedContact = await service.updateContactInGroup(contactData);
        return updatedContact;
    } catch (err) {
        console.log('Failed to update contact in group'+err.message );
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
    addLeadToGroup,
    addLead,
    removeLeadFromGroup,
    updateLeadInGroup,
    addContactToGroup,
    addContact,
    removeContactFromGroup,
    updateContactInGroup,
};