const { User, Board, Group, Lead, Contact } = require('../models/schema'); 

async function getLeadBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'leads',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: board._id,
            boardName: board.boardName,
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                leads: group.leads.map((lead) => {
                    const transformedAssignedTo = Array.isArray(lead.assignedToId)
                        ? lead.assignedToId.map((assigned) => ({
                              userId: assigned._id, 
                              email: assigned.email,
                              fullname: assigned.fullname,
                          }))
                        : null;
                    return {
                        itemId: lead._id,
                        leadName: lead.leadName,
                        assignedToId: transformedAssignedTo, 
                        status: lead.status || "",
                        dueDate: lead.dueDate || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


async function addLeadGroup(boardId, groupData) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'leads',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                leads: group.leads.map((lead) => ({
                    itemId: lead._id,
                    leadName: lead.leadName,
                    assignedToId: lead.assignedToId,
                    status: lead.status || "",
                    dueDate: lead.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
        throw { error: 'Failed to add group to board', details: err.message };
    }
}

async function removeLeadGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            throw new Error('Board containing the group not found');
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'leads',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: newboard._id,
            boardName: newboard.boardName,
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                leads: group.leads.map((lead) => ({
                    itemId: lead._id,
                    leadName: lead.leadName,
                    assignedToId: lead.assignedToId,
                    status: lead.status || "",
                    dueDate: lead.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
    }
}

async function getContactBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'contacts',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: board._id,
            boardName: board.boardName,
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                contacts: group.contacts.map((contact) => {
                    const transformedAssignedTo = Array.isArray(contact.assignedToId)
                        ? contact.assignedToId.map((assigned) => ({
                              userId: assigned._id, 
                              email: assigned.email,
                              fullname: assigned.fullname,
                          }))
                        : null;
                    return {
                        itemId: contact._id,
                        contactName: contact.contactName,
                        assignedToId: transformedAssignedTo, 
                        status: contact.status || "",
                        dueDate: contact.dueDate || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


async function addContactGroup(boardId, groupData) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'contacts',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                contacts: group.contacts.map((contact) => ({
                    itemId: contact._id,
                    contactName: contact.contactName,
                    assignedToId: contact.assignedToId,
                    status: contact.status || "",
                    dueDate: contact.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
        throw { error: 'Failed to add group to board', details: err.message };
    }
}

async function removeContactGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            throw new Error('Board containing the group not found');
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'contacts',
                    populate: {
                        path: 'assignedToId',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: newboard._id,
            boardName: newboard.boardName,
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                contacts: group.contacts.map((contact) => ({
                    itemId: contact._id,
                    contactName: contact.contactName,
                    assignedToId: contact.assignedToId,
                    status: contact.status || "",
                    dueDate: contact.dueDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
    }
}

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

async function addMembersToLead(itemId, userId) {
    try {
        const lead = await Lead.findById(itemId);
        if (!lead) {
            throw new Error('Lead not found');
        }
        const userAlreadyAssigned = lead.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this lead');
        }
        lead.assignedToId.push(userId);
        await lead.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the lead "${lead.leadName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await lead.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = lead.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to lead:', err);
        throw err;
    }
}

async function removeMembersFromLead(itemId, userId) {
    try {
        const lead = await Lead.findById(itemId);
        if (!lead) {
            throw new Error('Lead not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = lead.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this lead';
        }

        lead.assignedToId.splice(userIndex, 1);

        await lead.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the lead "${lead.leadName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await lead.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = lead.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from lead:', err);
        throw err;
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

async function addMembersToContact(itemId, userId) {
    try {
        const contact = await Contact.findById(itemId);
        if (!contact) {
            throw new Error('Contact not found');
        }
        const userAlreadyAssigned = contact.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this contact');
        }
        contact.assignedToId.push(userId);
        await contact.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the contact "${contact.contactName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await contact.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = contact.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to contact:', err);
        throw err;
    }
}

async function removeMembersFromContact(itemId, userId) {
    try {
        const contact = await Contact.findById(itemId);
        if (!contact) {
            throw new Error('Contact not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = contact.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this contact';
        }

        contact.assignedToId.splice(userIndex, 1);

        await contact.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the contact "${contact.contactName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await contact.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = contact.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from contact:', err);
        throw err;
    }
}

module.exports = {
    getLeadBoard,
    addLeadGroup,
    removeLeadGroup,
    getContactBoard,
    addContactGroup,
    removeContactGroup,
    addLeadToGroup,
    addLead,
    removeLeadFromGroup,
    updateLeadInGroup,
    addMembersToLead,
    removeMembersFromLead,
    addContactToGroup,
    addContact,
    removeContactFromGroup,
    updateContactInGroup,
    addMembersToContact,
    removeMembersFromContact,
};