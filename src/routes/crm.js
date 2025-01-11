const express = require('express');
const crmController = require('../controllers/crmcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspacesincrm', async (_, callback) => {
            const workspaces = await crmController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceByIdincrm', async (data, callback) => {
            const { id } = data;
            const workspace = await crmController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspaceincrm', async (data, callback) => {
            const workspace = await crmController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceByIdincrm', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await crmController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceByIdincrm', async (data, callback) => {
            const { id } = data;
            const result = await crmController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspaceincrm', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await crmController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspaceincrm', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await crmController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspaceincrm', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await crmController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspaceincrm', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await crmController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardByIdincrm', async (data, callback) => {
            const { boardId } = data;
            const board = await crmController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoardincrm', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await crmController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoardincrm', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await crmController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoardincrm', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await crmController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Lead events
        socket.on('addLeadToGroupincrm', async (data, callback) => {
            const { groupId, lead } = data;
            const updatedGroup = await crmController.addLeadToGroup(groupId, lead);
            callback(updatedGroup);
        });

        socket.on('createLeadincrm', async (data, callback) => {
            const { lead } = data;
            const leadData = await crmController.addLead(lead);
            callback(leadData);
        });

        socket.on('removeLeadFromGroupincrm', async (data, callback) => {
            const { leadId } = data;
            const updatedGroup = await crmController.removeLeadFromGroup(leadId);
            callback(updatedGroup);
        });

        socket.on('updateLeadInGroupincrm', async (data, callback) => {
            const { leadId, updateData } = data;
            const updatedItem = await crmController.updateLeadInGroup(leadId, updateData);
            callback(updatedItem);
        });

        // Contact events
        socket.on('addContactToGroupincrm', async (data, callback) => {
            const { groupId, contact } = data;
            const updatedGroup = await crmController.addContactToGroup(groupId, contact);
            callback(updatedGroup);
        });

        socket.on('createContactincrm', async (data, callback) => {
            const { contact } = data;
            const contactData = await crmController.addContact(contact);
            callback(contactData);
        });

        socket.on('removeContactFromGroupincrm', async (data, callback) => {
            const { contactId } = data;
            const updatedGroup = await crmController.removeContactFromGroup(contactId);
            callback(updatedGroup);
        });

        socket.on('updateContactInGroupincrm', async (data, callback) => {
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
