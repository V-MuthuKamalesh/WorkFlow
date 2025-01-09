const { Group, Ticket, Incident } = require('../models/schema'); 
// Task Functions
async function addTicketToGroup(groupId, ticketData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const ticket = new Ticket(ticketData);
        await ticket.save();
        group.tickets.push(ticket._id);
        await group.save();
        return group;
    } catch (err) {
        console.error('Error adding ticket to group:', err);
        throw { error: 'Failed to add ticket to group', details: err.message };
    }
}

async function addTicket(ticketData) {
    try {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return {ticketId:ticket._id};
    } catch (err) {
        console.error('Error creating ticket:', err);
        throw { error: 'Failed to create ticket ', details: err.message };
    }
}

async function removeTicketFromGroup(ticketId) {
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new Error('ticket not found');
        }
        const group = await Group.findOne({ tickets: ticketId });
        if (!group) {
            throw new Error('Group containing the ticket not found');
        }
        group.tickets = group.tickets.filter((id) => id.toString() !== ticketId);
        await group.save();
        await Ticket.findByIdAndDelete(ticketId);
        return group;
    } catch (err) {
        console.error('Error removing ticket from group:', err);
        throw { error: 'Failed to remove ticket from group', details: err.message };
    }
}

async function updateTicketInGroup(ticketData) {
    try {
        const ticket = await ticket.findById(ticketData._id);
        if (!ticket) {
            throw new Error('ticket not found');
        }
        const updatedTicket = await ticket.findByIdAndUpdate(
            ticketData._id,
            { $set: ticketData },
            { new: true }
        );
        return updatedTicket;
    } catch (err) {
        console.error('Error updating ticket in group:', err);
        throw { error: 'Failed to update ticket in group', details: err.message };
    }
}

// Sprint Functions
async function addIncidentToGroup(groupId, incidentData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const incident = new Incident(incidentData);
        await incident.save();
        group.incidents.push(incident._id);
        await group.save();
        return group;
    } catch (err) {
        console.error('Error adding incident to group:', err);
        throw { error: 'Failed to add incident to group', details: err.message };
    }
}

async function addIncident(incidentData) {
    try {
        const incident = new Incident(incidentData);
        await incident.save();
        return {incidentId:incident._id};
    } catch (err) {
        console.error('Error creating incident:', err);
        throw { error: 'Failed to create incident ', details: err.message };
    }
}

async function removeIncidentFromGroup(incidentId) {
    try {
        const incident = await Incident.findById(incidentId);
        if (!incident) {
            throw new Error('Incident not found');
        }
        const group = await Group.findOne({ incidents: incidentId });
        if (!group) {
            throw new Error('Group containing the incident not found');
        }
        group.incidents = group.incidents.filter((id) => id.toString() !== incidentId);
        await group.save();
        await Incident.findByIdAndDelete(incidentId);
        return group;
    } catch (err) {
        console.error('Error removing incident from group:', err);
        throw { error: 'Failed to remove incident from group', details: err.message };
    }
}

async function updateIncidentInGroup(incidentData) {
    try {
        const incident = await Incident.findById(incidentData._id);
        if (!incident) {
            throw new Error('Incident not found');
        }
        const updatedIncident = await Incident.findByIdAndUpdate(
            incidentData._id,
            { $set: incidentData },
            { new: true }
        );
        return updatedIncident;
    } catch (err) {
        console.error('Error updating incident in group:', err);
        throw { error: 'Failed to update incident in group', details: err.message };
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