const express = require('express');
const crmController = require('../controllers/crmcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspaces', async (_, callback) => {
            const workspaces = await crmController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const { id } = data;
            const workspace = await crmController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const workspace = await crmController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await crmController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const { id } = data;
            const result = await crmController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspace', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await crmController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await crmController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await crmController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await crmController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await crmController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await crmController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await crmController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await crmController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Lead events
        socket.on('addLeadToGroup', async (data, callback) => {
            const { groupId, lead } = data;
            const updatedGroup = await crmController.addLeadToGroup(groupId, lead);
            callback(updatedGroup);
        });

        socket.on('createLead', async (data, callback) => {
            const { lead } = data;
            const leadData = await crmController.addLead(lead);
            callback(leadData);
        });

        socket.on('removeLeadFromGroup', async (data, callback) => {
            const { leadId } = data;
            const updatedGroup = await crmController.removeLeadFromGroup(leadId);
            callback(updatedGroup);
        });

        socket.on('updateLeadInGroup', async (data, callback) => {
            const { leadId, updateData } = data;
            const updatedItem = await crmController.updateLeadInGroup(leadId, updateData);
            callback(updatedItem);
        });

        // Contact events
        socket.on('addContactToGroup', async (data, callback) => {
            const { groupId, contact } = data;
            const updatedGroup = await crmController.addContactToGroup(groupId, contact);
            callback(updatedGroup);
        });

        socket.on('createContact', async (data, callback) => {
            const { contact } = data;
            const contactData = await crmController.addContact(contact);
            callback(contactData);
        });

        socket.on('removeContactFromGroup', async (data, callback) => {
            const { contactId } = data;
            const updatedGroup = await crmController.removeContactFromGroup(contactId);
            callback(updatedGroup);
        });

        socket.on('updateContactInGroup', async (data, callback) => {
            const { contactId, updateData } = data;
            const updatedItem = await crmController.updateContactInGroup(contactId, updateData);
            callback(updatedItem);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return router;
};
