const service = require('../services/service');

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
    addLeadToGroup,
    addLead,
    removeLeadFromGroup,
    updateLeadInGroup,
    addContactToGroup,
    addContact,
    removeContactFromGroup,
    updateContactInGroup,
};