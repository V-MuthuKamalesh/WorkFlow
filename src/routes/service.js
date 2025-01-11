const express = require('express');
const serviceController = require('../controllers/servicecontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspacesinservice', async (_, callback) => {
            const workspaces = await serviceController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceByIdinservice', async (data, callback) => {
            const { id } = data;
            const workspace = await serviceController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspaceinservice', async (data, callback) => {
            const workspace = await serviceController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceByIdinservice', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await serviceController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceByIdinservice', async (data, callback) => {
            const { id } = data;
            const result = await serviceController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspaceinservice', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await serviceController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspaceinservice', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await serviceController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspaceinservice', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await serviceController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspaceinservice', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await serviceController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardByIdinservice', async (data, callback) => {
            const { boardId } = data;
            const board = await serviceController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoardinservice', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await serviceController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoardinservice', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await serviceController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoardinservice', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await serviceController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Ticket events
        socket.on('addTicketToGroupinservice', async (data, callback) => {
            const { groupId, ticket } = data;
            const updatedGroup = await serviceController.addTicketToGroup(groupId, ticket);
            callback(updatedGroup);
        });

        socket.on('createTicketinservice', async (data, callback) => {
            const { ticket } = data;
            const ticketData = await serviceController.addTicket(ticket);
            callback(ticketData);
        });

        socket.on('removeTicketFromGroupinservice', async (data, callback) => {
            const { ticketId } = data;
            const updatedGroup = await serviceController.removeTicketFromGroup(ticketId);
            callback(updatedGroup);
        });

        socket.on('updateTicketInGroupinservice', async (data, callback) => {
            const { ticketId, updateData } = data;
            const updatedItem = await serviceController.updateTicketInGroup(ticketId, updateData);
            callback(updatedItem);
        });

        // Incident events
        socket.on('addIncidentToGroupinservice', async (data, callback) => {
            const { groupId, incident } = data;
            const updatedGroup = await serviceController.addIncidentToGroup(groupId, incident);
            callback(updatedGroup);
        });

        socket.on('createIncidentinservice', async (data, callback) => {
            const { incident } = data;
            const incidentData = await serviceController.addIncident(incident);
            callback(incidentData);
        });

        socket.on('removeIncidentFromGroupinservice', async (data, callback) => {
            const { incidentId } = data;
            const updatedGroup = await serviceController.removeIncidentFromGroup(incidentId);
            callback(updatedGroup);
        });

        socket.on('updateIncidentInGroupinservice', async (data, callback) => {
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
