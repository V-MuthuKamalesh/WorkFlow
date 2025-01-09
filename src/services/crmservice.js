const { Group, Lead, Contact } = require('../models/schema'); 
// Lead Functions
async function addLeadToGroup(groupId, leadData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const lead = new Lead(leadData);
        await lead.save();
        group.leads.push(lead._id);
        await group.save();
        return group;
    } catch (err) {
        console.error('Error adding lead to group:', err);
        throw { error: 'Failed to add lead to group', details: err.message };
    }
}

async function addLead(leadData) {
    try {
        const lead = new Lead(leadData);
        await lead.save();
        return {leadId:lead._id};
    } catch (err) {
        console.error('Error creating lead:', err);
        throw { error: 'Failed to create lead ', details: err.message };
    }
}

async function removeLeadFromGroup(leadId) {
    try {
        const lead = await Lead.findById(leadId);
        if (!lead) {
            throw new Error('lead not found');
        }
        const group = await Group.findOne({ leads: leadId });
        if (!group) {
            throw new Error('Group containing the lead not found');
        }
        group.leads = group.leads.filter((id) => id.toString() !== leadId);
        await group.save();
        await Lead.findByIdAndDelete(leadId);
        return group;
    } catch (err) {
        console.error('Error removing lead from group:', err);
        throw { error: 'Failed to remove lead from group', details: err.message };
    }
}

async function updateLeadInGroup(leadData) {
    try {
        const lead = await lead.findById(leadData._id);
        if (!leadead) {
            throw new Error('lead not found');
        }
        const updatedLead = await lead.findByIdAndUpdate(
            leadData._id,
            { $set: leadData },
            { new: true }
        );
        return updatedLead;
    } catch (err) {
        console.error('Error updating lead in group:', err);
        throw { error: 'Failed to update lead in group', details: err.message };
    }
}

// Contact Functions
async function addContactToGroup(groupId, contactData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const contact = new Contact(contactData);
        await contactontact.save();
        group.contacts.push(contact._id);
        await group.save();
        return group;
    } catch (err) {
        console.error('Error adding contact to group:', err);
        throw { error: 'Failed to add contact to group', details: err.message };
    }
}

async function addContact(contactData) {
    try {
        const contact = new Contact(contactData);
        await contact.save();
        return {contactId:contact._id};
    } catch (err) {
        console.error('Error creating contact:', err);
        throw { error: 'Failed to create contact ', details: err.message };
    }
}

async function removeContactFromGroup(contactId) {
    try {
        const contact = await Contact.findById(contactId);
        if (!contact) {
            throw new Error('Contact not found');
        }
        const group = await Group.findOne({ contacts: contactId });
        if (!group) {
            throw new Error('Group containing the contact not found');
        }
        group.contacts = group.contacts.filter((id) => id.toString() !== contactId);
        await group.save();
        await Contact.findByIdAndDelete(contactId);
        return group;
    } catch (err) {
        console.error('Error removing contact from group:', err);
        throw { error: 'Failed to remove contact from group', details: err.message };
    }
}

async function updateContactInGroup(contactData) {
    try {
        const contact = await Contact.findById(contactData._id);
        if (!contact) {
            throw new Error('Contact not found');
        }
        const updatedContact = await Contact.findByIdAndUpdate(
            contactData._id,
            { $set: contactData },
            { new: true }
        );
        return updatedContact;
    } catch (err) {
        console.error('Error updating contact in group:', err);
        throw { error: 'Failed to update contact in group', details: err.message };
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