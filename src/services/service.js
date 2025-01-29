const { User, Module, Workspace, Board, Group, Ticket } = require('../models/schema'); 
const { sendNotification } = require('../utils/notification');

async function getTicketBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tickets',
                    populate: [
                        {
                            path: 'employee',
                            select: '_id email fullname',
                        },
                        {
                            path: 'agent',
                            select: '_id email fullname',
                        },
                    ],
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
                items: group.tickets.map((ticket) => ({
                    itemId: ticket._id,
                    ticketName: ticket.ticketName,
                    description: ticket.description || "",
                    employee: ticket.employee.map((assigned) => ({
                        userId: assigned._id,
                        email: assigned.email,
                        fullname: assigned.fullname,
                    })),
                    agent: ticket.agent.map((assigned) => ({
                        userId: assigned._id,
                        email: assigned.email,
                        fullname: assigned.fullname,
                    })),
                    priority: ticket.priority || "",
                    status: ticket.status || "",
                    requestType: ticket.requestType || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
    }
}

// Group Functions
async function addTicketGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
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
                    populate: {
                        path: 'employee',
                        select: '_id email fullname',
                    },
                    populate: {
                        path: 'agent',
                        select: '_id email fullname',
                    },
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
    }
}

async function removeTicketGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne(group.boardId);
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const ticket of group.tickets) {
            await removeTicketFromGroup(ticket._id);
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tickets',
                    populate: {
                        path: 'employee',
                        select: '_id email fullname',
                    },
                    populate: {
                        path: 'agent',
                        select: '_id email fullname',
                    },
                },
            });
        if (!board) {
            console.log('Board not found');
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
    }
}

// Ticket Functions
async function addTicketToGroup(groupId, ticketData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
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
            : [];
        const transformedAgent = Array.isArray(ticket.developer)
            ? ticket.agent.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : [];
        return {itemId:ticket._id, ticketName: ticket.ticketName, description: ticket.description || "", status: ticket.status || "", priority: ticket.priority || "",requestType: ticket.requestType || "", employee: transformedEmployee, agent: transformedAgent,};
    } catch (err) {
        console.error('Error adding ticket to group:', err);
    }
}

async function addTicket(ticketData) {
    try {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return {itemId:ticket._id};
    } catch (err) {
        console.error('Error creating ticket:', err);
    }
}

async function removeTicketFromGroup(ticketId) {
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            console.log('ticket not found');
        }
        let group = await Group.findOne({ tickets: ticketId });
        if (!group) {
            console.log('Group containing the ticket not found');
        }
        group.tickets = group.tickets.filter((id) => id.toString() !== ticketId);
        await group.save();
        await Ticket.findByIdAndDelete(ticketId);
        group = await Group.findById(group._id).populate({
            path: 'tickets',
            populate: [
                {
                    path: 'employee',
                    select: '_id email fullname',
                },
                {
                    path: 'agent',
                    select: '_id email fullname',
                },
            ],
        });
        return {
            groupId: group._id,
            groupName: group.groupName,
            items: group.tickets.map((ticket) => ({
                itemId: ticket._id,
                ticketName: ticket.ticketName,
                description: ticket.description || "",
                employee: ticket.employee.map((assigned) => ({
                    userId: assigned._id,
                    email: assigned.email,
                    fullname: assigned.fullname,
                })),
                agent: ticket.agent.map((assigned) => ({
                    userId: assigned._id,
                    email: assigned.email,
                    fullname: assigned.fullname,
                })),
                priority: ticket.priority || "",
                status: ticket.status || "",
                requestType: ticket.requestType || "",
            })),
        };
    } catch (err) {
        console.error('Error removing ticket from group:', err);
    }
}

async function updateTicketInGroup(ticketData, boardId, userId) {
    try {
        const ticket = await Ticket.findById(ticketData._id);
        if (!ticket) {
            console.log('ticket not found');
        }
        const isEmployee = ticket.employee.some(employeeId => employeeId.toString() === userId);
        const isAgent = ticket.agent.some(agentId => agentId.toString() === userId);
        
        const workspace = await Workspace.findOne({ boards: boardId });
        const isAdmin = workspace.members.some(member => 
            member.userId.toString() === userId.toString() && member.role === 'admin'
          );

        if (!isEmployee && !isAgent && !isAdmin) {
            console.log('Permission denied: User cannot update this bug');
            return null;
        }
        ticketData = {
            ...ticketData,
            employee: ticketData.employee.map(user => user.userId),
            agent: ticketData.agent.map(user => user.userId),
        };
        const updatedTicket = await Ticket.findByIdAndUpdate(
            ticketData._id,
            { $set: ticketData },
            { new: true }
        );
        const person = await User.findById(userId);
        const users = await User.find({ _id: { $in: [...ticketData.employee, ...ticketData.agent] } });
        let notification;
        const notificationPromises = users.map(async (user) => {
            const message = `${person.fullname} has updated the ticket "${ticket.ticketName}". Please review the updates.`;
            await sendNotification(user, message);
        });
        await Promise.all(notificationPromises);
        return {item:updatedTicket, message:notification};
    } catch (err) {
        console.error('Error updating ticket in group:', err);
    }
}

async function addMembersToAgent(itemId, userId, adminId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            console.log('Ticket not found');
        }
        const userAlreadyAssigned = ticket.agent.some(
            (id) => id.toString() === userId
        );
        let notification;
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this ticket');
        }else{
            ticket.agent.push(userId);
            await ticket.save();
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
            }
            const person = await User.findById(adminId);
            const message = `Hello ${user.fullname},\n\nYou have been assigned to the ticket "${ticket.ticketName} by ${person.fullname}". Please check the details and take necessary actions.\n\nThank you!`;
            notification = await sendNotification(user, message);
        }
        await ticket.populate({
            path: 'agent',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.agent.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { item:{assignedToId: transformedAssignedTo}, message:notification };
    } catch (err) {
        console.error('Error adding members to ticket:', err);
    }
}

async function removeMembersFromAgent(itemId, userId, adminId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            console.log('Ticket not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = ticket.agent.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this ticket';
        }

        ticket.agent.splice(userIndex, 1);

        await ticket.save();
        const person = await User.findById(adminId);
        const message = `Hello ${user.fullname},\n\nYou have been removed from the ticket "${ticket.ticketName} by ${person.fullname}".\n\nThank you!`;
        let notification = await sendNotification(user, message);

        await ticket.populate({
            path: 'agent',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.agent.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { item:{assignedToId: transformedAssignedTo}, message:notification };
    } catch (err) {
        console.error('Error removing members from ticket:', err);
    }
}

async function addMembersToEmployee(itemId, userId, adminId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            console.log('Ticket not found');
        }
        const userAlreadyAssigned = ticket.employee.some(
            (id) => id.toString() === userId
        );
        let notification;
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this ticket');
        }else{
            ticket.employee.push(userId);
            await ticket.save();
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
            }
            const person = await User.findById(adminId);
            const message = `Hello ${user.fullname},\n\nYou have been assigned to the ticket "${ticket.ticketName} by ${person.fullname}". Please check the details and take necessary actions.\n\nThank you!`;
            notification = await sendNotification(user, message);
        }
        await ticket.populate({
            path: 'employee',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.employee.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { item:{assignedToId: transformedAssignedTo}, message:notification };
    } catch (err) {
        console.error('Error adding members to ticket:', err);
    }
}

async function removeMembersFromEmployee(itemId, userId, adminId) {
    try {
        const ticket = await Ticket.findById(itemId);
        if (!ticket) {
            console.log('Ticket not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = ticket.employee.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this ticket';
        }

        ticket.employee.splice(userIndex, 1);

        await ticket.save();
        const person = await User.findById(adminId);
        const message = `Hello ${user.fullname},\n\nYou have been removed from the ticket "${ticket.ticketName} by ${person.fullname}".\n\nThank you!`;
        let notification = await sendNotification(user, message);

        await ticket.populate({
            path: 'employee',
            select: '_id email fullname',
        });

        const transformedAssignedTo = ticket.employee.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { item:{assignedToId: transformedAssignedTo}, message:notification };
    } catch (err) {
        console.error('Error removing members from ticket:', err);
    }
}

async function getWorkspacesWithTicketCounts(moduleId, userId, workspaceId) {
    try {
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: {
                    path: 'groups',
                    populate: {
                        path: 'tickets',
                        populate: [
                            {
                                path: 'employee',
                                select: '_id email fullname',
                            },
                            {
                                path: 'agent',
                                select: '_id email fullname',
                            },
                        ],
                    },
                },
            },
        });
        const filteredWorkspaces = module.workspaces.filter((workspace) =>
            workspace.members.some((member) => member.userId.toString() === userId)
        );
        const relevantWorkspaces = workspaceId
            ? filteredWorkspaces.filter(workspace => workspace._id.toString() === workspaceId)
            : filteredWorkspaces;

        const workspaceData = relevantWorkspaces.map((workspace) => {
            let totalTickets = 0;
            let completedTickets = 0; 
            let inProgressTickets = 0; 
            let pendingTickets = 0; 
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.tickets.forEach((ticket) => {
                        const isAgentMatch = ticket.agent.some(
                            (assignedAgent) => assignedAgent._id.toString() === userId
                        );
                        if (isAgentMatch) {
                            totalTickets++;
                            if (ticket.status === 'Resolved') {
                                completedTickets++;
                            } else if (ticket.status === 'Awaiting Customer') {
                                inProgressTickets++;
                            } else {
                                pendingTickets++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceId: workspace._id,
                workspaceName: workspace.workspaceName,
                totalTickets,
                completedTickets,
                inProgressTickets,
                pendingTickets,
            };
        });
        const employeeData = relevantWorkspaces.map((workspace) => {
            let totalTickets = 0;
            let completedTickets = 0; 
            let inProgressTickets = 0; 
            let pendingTickets = 0; 
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.tickets.forEach((ticket) => {
                        const isAgentMatch = ticket.employee.some(
                            (assignedAgent) => assignedAgent._id.toString() === userId
                        );
                        if (isAgentMatch) {
                            totalTickets++;
                            if (ticket.status === 'Resolved') {
                                completedTickets++;
                            } else if (ticket.status === 'Awaiting Customer') {
                                inProgressTickets++;
                            } else {
                                pendingTickets++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceId: workspace._id,
                workspaceName: workspace.workspaceName,
                totalTickets,
                completedTickets,
                inProgressTickets,
                pendingTickets,
            };
        });
        return {type:"service",agentStats:workspaceData, employeeStats:employeeData};
    } catch (err) {
        console.error('Error fetching workspaces with ticket counts:', err);
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
    addMembersToEmployee,
    removeMembersFromEmployee,
    addMembersToAgent,
    removeMembersFromAgent,
    getWorkspacesWithTicketCounts,
};