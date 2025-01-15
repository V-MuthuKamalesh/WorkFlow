const express = require('express');
const crmController = require('../controllers/crmcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

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
