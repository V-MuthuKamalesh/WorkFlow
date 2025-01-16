const { User, Board, Group, Ticket } = require('../models/schema'); 

async function getTicketBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tickets',
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
                items: group.tickets.map((ticket) => {
                    return {
                        itemId: ticket._id,
                        ticketName: ticket.ticketName,
                        description: ticket.description || "",
                        employee: ticket.employee || [],
                        agent: ticket.agent || [],
                        priority: ticket.priority || "",
                        status: ticket.status || "",
                        requestType: ticket.requestType || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


// Group Functions
async function addTicketGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
        }
        groupData.tickets = [itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tickets',
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
                items: group.tickets.map((ticket) => ({
                    itemId: ticket._id,
                    ticketName: ticket.ticketName,
                    description: ticket.description || "",
                    employee: ticket.employee || [],
                    agent: ticket.agent || [],
                    priority: ticket.priority || "",
                    status: ticket.status || "",
                    requestType: ticket.requestType || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
        throw { error: 'Failed to add group to board', details: err.message };
    }
}

async function removeTicketGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const board = await Board.findOne(group.boardId);
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
                    path: 'tickets',
                },
            });
        if (!board) {
            throw new Error('Board not found');
        }
        return {
            boardId: newboard._id,
            boardName: newboard.boardName,
            type: newboard.type || "",
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.tickets.map((ticket) => ({
                    itemId: ticket._id,
                    ticketName: ticket.ticketName,
                    reporter: ticket.reporter || [],
                    developer: ticket.developer || [],
                    priority: ticket.priority || "",
                    status: ticket.status || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
    }
}

// Ticket Functions
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
        const transformedEmployee = Array.isArray(ticket.reporter)
            ? ticket.employee.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        const transformedAgent = Array.isArray(ticket.developer)
            ? ticket.agent.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        return {itemId:ticket._id, ticketName: ticket.ticketName, description: ticket.description || "", status: ticket.status || "", priority: ticket.priority || "",requestType: ticket.requestType || "", employee: transformedEmployee, agent: transformedAgent,};
    } catch (err) {
        console.error('Error adding ticket to group:', err);
        throw { error: 'Failed to add ticket to group', details: err.message };
    }
}

async function addTicket(ticketData) {
    try {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return {itemId:ticket._id};
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

async function addMembersToTicket(itemId, userId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }
        const userAlreadyAssigned = ticket.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this ticket');
        }
        ticket.assignedToId.push(userId);
        await ticket.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the ticket "${ticket.ticketName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await ticket.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to ticket:', err);
        throw err;
    }
}

async function removeMembersFromTicket(itemId, userId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = ticket.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this ticket';
        }

        ticket.assignedToId.splice(userIndex, 1);

        await ticket.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the ticket "${ticket.ticketName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await ticket.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from ticket:', err);
        throw err;
    }
}


module.exports = {
    getTicketBoard,
    addTicketGroup,
    removeTicketGroup,
    addTicketToGroup,
    addTicket,
    removeTicketFromGroup,
    updateTicketInGroup,
    addMembersToTicket,
    removeMembersFromTicket,
};