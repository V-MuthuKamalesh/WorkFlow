const { User, Board, Group, Lead } = require('../models/schema'); 

async function getLeadBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'leads',
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: board._id,
            boardName: board.boardName,
            type: board.type || "",
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.leads.map((lead) => {
                    return {
                        itemId: lead._id,
                        leadName: lead.leadName,
                        status: lead.status || "",
                        company: lead.company || "",
                        title: lead.title || "",
                        email: lead.email || "",
                        lastInteraction: lead.lastInteraction || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


async function addLeadGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        groupData.leads = [itemId];
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
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            type: board.type || "",
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.leads.map((lead) => ({
                    itemId: lead._id,
                    leadName: lead.leadName,
                    status: lead.status || "",
                    company: lead.company || "",
                    title: lead.title || "",
                    email: lead.email || "",
                    lastInteraction: lead.lastInteraction || "",
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
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: newboard._id,
            boardName: newboard.boardName,
            type: board.type || "",
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.leads.map((lead) => ({
                    itemId: lead._id,
                    leadName: lead.leadName,
                    status: lead.status || "",
                    company: lead.company || "",
                    title: lead.title || "",
                    email: lead.email || "",
                    lastInteraction: lead.lastInteraction || "",
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
        return {itemId:lead._id, leadName: lead.leadName, status: lead.status || "", company: lead.company || "", title: lead.title || "",email: lead.email || "", lastInteraction: lead.lastInteraction || "",};
    } catch (err) {
        console.error('Error adding lead to group:', err);
        throw { error: 'Failed to add lead to group', details: err.message };
    }
}

async function addLead(leadData) {
    try {
        const lead = new Lead(leadData);
        await lead.save();
        return {itemId:lead._id};
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

module.exports = {
    getLeadBoard,
    addLeadGroup,
    removeLeadGroup,
    addLeadToGroup,
    addLead,
    removeLeadFromGroup,
    updateLeadInGroup,
    addMembersToLead,
    removeMembersFromLead,
};