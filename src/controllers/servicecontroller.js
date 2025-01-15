const service = require('../services/service');

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
    addTicketToGroup,
    addTicket,
    removeTicketFromGroup,
    updateTicketInGroup,
    addIncidentToGroup,
    addIncident,
    removeIncidentFromGroup,
    updateIncidentInGroup,
};