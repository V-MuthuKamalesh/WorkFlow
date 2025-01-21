const { Module, Board, Group, Lead } = require('../models/schema'); 

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
            console.log('Board not found');
        }
        return {
            boardId: board._id,
            boardName: board.boardName,
            type: board.type || "",
            workspaceName: board.workspaceName,
            workspaceId: board.workspaceId,
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
    }
}


async function addLeadGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
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
    }
}

async function removeLeadGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const lead of group.leads) {
            await removeLeadFromGroup(lead._id);
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
            console.log('Board not found');
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
    }
}

// Lead Functions
async function addLeadToGroup(groupId, leadData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const lead = new Lead(leadData);
        await lead.save();
        group.leads.push(lead._id);
        await group.save();
        return {itemId:lead._id, leadName: lead.leadName, status: lead.status || "", company: lead.company || "", title: lead.title || "",email: lead.email || "", lastInteraction: lead.lastInteraction || "",};
    } catch (err) {
        console.error('Error adding lead to group:', err);
    }
}

async function addLead(leadData) {
    try {
        const lead = new Lead(leadData);
        await lead.save();
        return {itemId:lead._id};
    } catch (err) {
        console.error('Error creating lead:', err);
    }
}

async function removeLeadFromGroup(leadId) {
    try {
        const lead = await Lead.findById(leadId);
        if (!lead) {
            console.log('lead not found');
        }
        let group = await Group.findOne({ leads: leadId });
        if (!group) {
            console.log('Group containing the lead not found');
        }
        group.leads = group.leads.filter((id) => id.toString() !== leadId);
        await group.save();
        await Lead.findByIdAndDelete(leadId);
        group = await Group.findById(group._id).populate('leads');
        return {
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
        };
    } catch (err) {
        console.error('Error removing lead from group:', err);
    }
}

async function updateLeadInGroup(leadData) {
    try {
        const lead = await Lead.findById(leadData._id);
        if (!lead) {
            console.log('lead not found');
        }
        const updatedLead = await Lead.findByIdAndUpdate(
            leadData._id,
            { $set: leadData },
            { new: true }
        );
        return updatedLead;
    } catch (err) {
        console.error('Error updating lead in group:', err);
    }
}

async function getWorkspacesWithLeadCounts(moduleId, userId) {
    try {
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: [
                {
                    path: 'members',
                    select: '_id',
                },
                {
                    path: 'boards',
                    populate: {
                        path: 'groups',
                        populate: {
                            path: 'leads',
                        },
                    },
                },
            ],
        });
        if (!module) {
            console.log('Module not found');
        }
        const filteredWorkspaces = module.workspaces.filter((workspace) =>
            workspace.members.some((member) => member.userId.toString() === userId)
        );
        const workspaceData = filteredWorkspaces.map((workspace) => {
            let totalLeads = 0;
            let completedLeads = 0; 
            let inProgressLeads = 0; 
            let pendingLeads = 0; 
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.leads.forEach((lead) => {
                        totalLeads++;
                        if (lead.status === 'Qualified') {
                            completedLeads++;
                        } else if (lead.status === 'Attempted to Contact') {
                            inProgressLeads++;
                        } else {
                            pendingLeads++;
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalLeads,
                completedLeads,
                inProgressLeads,
                pendingLeads,
            };
        });
        return {type:"crm",leadStats:workspaceData};
    } catch (err) {
        console.error('Error fetching workspaces with lead counts:', err);
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
    getWorkspacesWithLeadCounts,
};