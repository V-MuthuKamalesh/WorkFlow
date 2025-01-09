const express = require('express');
const serviceController = require('../controllers/servicecontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspaces', async (_, callback) => {
            const workspaces = await serviceController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const { id } = data;
            const workspace = await serviceController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const workspace = await serviceController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await serviceController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const { id } = data;
            const result = await serviceController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspace', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await serviceController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await serviceController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await serviceController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await serviceController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await serviceController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await serviceController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await serviceController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await serviceController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Ticket events
        socket.on('addTicketToGroup', async (data, callback) => {
            const { groupId, ticket } = data;
            const updatedGroup = await serviceController.addTicketToGroup(groupId, ticket);
            callback(updatedGroup);
        });

        socket.on('createTicket', async (data, callback) => {
            const { ticket } = data;
            const ticketData = await serviceController.addTicket(ticket);
            callback(ticketData);
        });

        socket.on('removeTicketFromGroup', async (data, callback) => {
            const { ticketId } = data;
            const updatedGroup = await serviceController.removeTicketFromGroup(ticketId);
            callback(updatedGroup);
        });

        socket.on('updateTicketInGroup', async (data, callback) => {
            const { ticketId, updateData } = data;
            const updatedItem = await serviceController.updateTicketInGroup(ticketId, updateData);
            callback(updatedItem);
        });

        // Incident events
        socket.on('addIncidentToGroup', async (data, callback) => {
            const { groupId, incident } = data;
            const updatedGroup = await serviceController.addIncidentToGroup(groupId, incident);
            callback(updatedGroup);
        });

        socket.on('createIncident', async (data, callback) => {
            const { incident } = data;
            const incidentData = await serviceController.addSncident(incident);
            callback(incidentData);
        });

        socket.on('removeIncidentFromGroup', async (data, callback) => {
            const { incidentId } = data;
            const updatedGroup = await serviceController.removeIncidentFromGroup(incidentId);
            callback(updatedGroup);
        });

        socket.on('updateIncidentInGroup', async (data, callback) => {
            const { incidentId, updateData } = data;
            const updatedItem = await serviceController.updateIncidentInGroup(incidentId, updateData);
            callback(updatedItem);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return router;
};
