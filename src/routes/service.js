const express = require('express');
const serviceController = require('../controllers/servicecontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

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
            const incidentData = await serviceController.addIncident(incident);
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
