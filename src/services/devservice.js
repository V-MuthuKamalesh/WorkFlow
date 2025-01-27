const { User, Module, Workspace, Board, Group, Task, Sprint, Bug } = require('../models/schema'); 
const { sendNotification } = require('../utils/notification');

async function getBugBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'bugs',
                    populate: [
                        {
                            path: 'reporter',
                            select: '_id email fullname',
                        },
                        {
                            path: 'developer',
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
                items: group.bugs.map((bug) => ({
                    itemId: bug._id,
                    bugName: bug.bugName,
                    reporter: bug.reporter.map((assigned) => ({
                        userId: assigned._id,
                        email: assigned.email,
                        fullname: assigned.fullname,
                    })),
                    developer: bug.developer.map((assigned) => ({
                        userId: assigned._id,
                        email: assigned.email,
                        fullname: assigned.fullname,
                    })),
                    priority: bug.priority || "",
                    status: bug.status || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
    }
}

// Group Functions
async function addBugGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        groupData.bugs=[itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'bugs',
                    populate: {
                        path: 'reporter',
                        select: '_id email fullname',
                    },
                    populate: {
                        path: 'developer',
                        select: '_id email fullname',
                    },
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            type: populatedBoard.type || "",
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.bugs.map((bug) => ({
                    itemId: bug._id,
                    bugName: bug.bugName,
                    reporter: bug.reporter || [],
                    developer: bug.developer || [],
                    priority: bug.priority || "",
                    status: bug.status || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
    }
}

async function removeBugGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const bug of group.bugs) {
            await removeBugFromGroup(bug._id);
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'bugs',
                    populate: {
                        path: 'reporter',
                        select: '_id email fullname',
                    },
                    populate: {
                        path: 'developer',
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
                items: group.bugs.map((bug) => ({
                    itemId: bug._id,
                    bugName: bug.bugName,
                    reporter: bug.reporter || [],
                    developer: bug.developer || [],
                    priority: bug.priority || "",
                    status: bug.status || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
    }
}

async function getSprintBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'sprints',
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
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.sprints.map((sprint) => {
                    return {
                        itemId: sprint._id,
                        sprintName: sprint.sprintName,
                        sprintGoals: sprint.sprintGoals || "",
                        startDate: sprint.startDate || "",
                        endDate: sprint.endDate || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
    }
}


// Group Functions
async function addSprintGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        groupData.sprints=[itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'sprints',
                },
            });

        return {
            boardId: populatedBoard._id,
            boardName: populatedBoard.boardName,
            type: populatedBoard.type || "",
            workspaceName: populatedBoard.workspaceName,
            groups: populatedBoard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.sprints.map((sprint) => ({
                    itemId: sprint._id,
                    sprintName: sprint.sprintName,
                    sprintGoals: sprint.sprintGoals || "",
                    startDate: sprint.startDate || "",
                    endDate: sprint.endDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
    }
}

async function removeSprintGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const sprint of group.sprints) {
            await removeSprintFromGroup(sprint._id);
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'sprints',
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
                items: group.sprints.map((sprint) => ({
                    itemId: sprint._id,
                    sprintName: sprint.sprintName,
                    sprintGoals: sprint.sprintGoals || "",
                    startDate: sprint.startDate || "",
                    endDate: sprint.endDate || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from board:', err);
    }
}

async function getTaskBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tasks',
                    populate: {
                        path: 'person',
                        select: '_id email fullname',
                    },
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
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.tasks.map((task) => {
                    const transformedAssignedTo = Array.isArray(task.person)
                        ? task.person.map((assigned) => ({
                              userId: assigned._id, 
                              email: assigned.email,
                              fullname: assigned.fullname,
                          }))
                        : null;
                    return {
                        itemId: task._id,
                        taskName: task.taskName,
                        person: transformedAssignedTo, 
                        status: task.status || "",
                        priority: task.priority || "",
                    };
                }),
            })),
        };
    } catch (err) {
        console.error('Error fetching board:', err);
    }
}


// Group Functions
async function addTaskGroup(boardId, groupData, itemId, sprintId) {
    try {
        console.log(boardId, groupData, itemId, sprintId);
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        const sprint = await Sprint.findById(sprintId);
        groupData.tasks=[itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
        sprint.connectedGroup=group._id;
        await sprint.save();
        board.groups.push(group._id);
        await board.save();
        const populatedBoard = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tasks',
                    populate: {
                        path: 'person',
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
                items: group.tasks.map((task) => ({
                    itemId: task._id,
                    taskName: task.taskName,
                    person: task.person,
                    status: task.status || "",
                    priority: task.priority || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error adding group to board:', err);
    }
}

async function removeTaskGroup(groupId) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const board = await Board.findOne({ groups: groupId });
        if (!board) {
            console.log('Board containing the group not found');
        }
        for (const task of group.tasks) {
            await removeTaskFromGroup(task._id);
        }
        board.groups = board.groups.filter(group => group.toString() !== groupId);
        await board.save();
        await Group.findByIdAndDelete(groupId);
        const newboard = await Board.findById(group.boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'tasks',
                    populate: {
                        path: 'person',
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
            workspaceName: newboard.workspaceName,
            groups: newboard.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.tasks.map((task) => ({
                    itemId: task._id,
                    taskName: task.taskName,
                    person: task.person,
                    status: task.status || "",
                    priority: task.priority || "",
                })),
            })),
        };
    } catch (err) {
        console.error('Error removing group from task board:', err);
    }
}

// Task Functions
async function addTaskToGroup(groupId, taskData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const task = new Task(taskData);
        await task.save();
        group.tasks.push(task._id);
        await group.save();
        const transformedAssignedTo = Array.isArray(task.assignedToId)
            ? task.assignedToId.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        return {itemId:task._id, taskName: task.taskName, assignedToId: transformedAssignedTo, status: task.status || "", priority: task.priority || "",};
    } catch (err) {
        console.error('Error adding task to group:', err);
    }
}

async function addTask(taskData) {
    try {
        const task = new Task(taskData);
        await task.save();
        return {itemId:task._id};
    } catch (err) {
        console.error('Error creating task:', err);
    }
}

async function removeTaskFromGroup(taskId) {
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            console.log('task not found');
        }
        let group = await Group.findOne({ tasks: taskId });
        if (!group) {
            console.log('Group containing the task not found');
        }
        group.tasks = group.tasks.filter((id) => id.toString() !== taskId);
        await group.save();
        await Task.findByIdAndDelete(taskId);
        group = await Group.findById(group._id).populate({
            path: 'tasks',
            populate: {
                path: 'person',
                select: '_id email fullname',
            },
        });
        return {
            groupId: group._id,
            groupName: group.groupName,
            items: group.tasks.map((task) => {
                const transformedAssignedTo = Array.isArray(task.person)
                    ? task.person.map((assigned) => ({
                          userId: assigned._id,
                          email: assigned.email,
                          fullname: assigned.fullname,
                      }))
                    : null;
                return {
                    itemId: task._id,
                    taskName: task.taskName,
                    person: transformedAssignedTo,
                    status: task.status || "",
                    dueDate: task.dueDate || "",
                };
            }),
        };
    } catch (err) {
        console.error('Error removing task from group:', err);
    }
}

async function updateTaskInGroup(taskData, boardId, userId) {
    try {
        const task = await Task.findById(taskData._id);
        if (!task) {
            console.log('task not found');
        }
        const isAssigned = task.person.some(person => person.toString() === userId);
        
        const workspace = await Workspace.findOne({ boards: boardId });
        const isAdmin = workspace.members.some(member => 
            member.userId.toString() === userId.toString() && member.role === 'admin'
          );

        if (!isAssigned  && !isAdmin) {
            console.log('Permission denied: User cannot update this bug');
            return null;
        }
        taskData = {
            ...taskData,
            person: taskData.person.map(user => user.userId),
        };
        const updatedTask = await Task.findByIdAndUpdate(
            taskData._id,
            { $set: taskData },
            { new: true }
        );
        const person = await User.findById(userId);
        const users = await User.find({ _id: { $in: taskData.person } });
        const notificationPromises = users.map(async (user) => {
            const message = `${person.fullname} has updated the task "${task.taskName}". Please review the details.`;
            await sendNotification(user, message);
        });
        await Promise.all(notificationPromises);
        return updatedTask;
    } catch (err) {
        console.error('Error updating task in group:', err);
    }
}

async function addMembersToTask(itemId, userId, adminId) {
    try {
        const task = await Task.findById(itemId);
        if (!task) {
            console.log('Task not found');
        }
        const userAlreadyAssigned = task.person.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this task');
        }
        task.person.push(userId);
        await task.save();
        const user = await User.findById(userId);
        const person = await User.findById(adminId);
        if (!user) {
            console.log('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the task "${task.taskName}" by ${person.fullname}. Please check the details and take the necessary actions.\n\nThank you!`;
        await sendNotification(user, message);
        await task.populate({
            path: 'person',
            select: '_id email fullname',
        });

        const transformedAssignedTo = task.person.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to task:', err);
    }
}

async function removeMembersFromTask(itemId, userId, adminId) {
    try {
        const task = await Task.findById(itemId);
        if (!task) {
            console.log('Task not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = task.person.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this task';
        }

        task.person.splice(userIndex, 1);

        await task.save();
        const person = await User.findById(adminId);
        const message = `Hello ${user.fullname},\n\nYou have been removed from the task "${task.taskName} by ${person.fullname}".\n\nThank you!`;
        await sendNotification(user, message);

        await task.populate({
            path: 'person',
            select: '_id email fullname',
        });

        const transformedAssignedTo = task.person.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from task:', err);
    }
}


// Sprint Functions
async function addSprintToGroup(groupId, sprintData, boardId) {
    try {
        const sprintBoard = await Board.findById(boardId);
        const taskBoard = await Board.findOne({boardName:sprintBoard.boardName+"-Task"});
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const groupData = {groupName: sprintData.sprintName};
        const taskData = {taskName: sprintData.sprintName+" Task"};
        const { itemId } = await addTask(taskData);
        const sprint = new Sprint(sprintData);
        await sprint.save();
        await addTaskGroup(taskBoard._id, groupData, itemId, sprint._id);
        group.sprints.push(sprint._id);
        await group.save();
        return {itemId:sprint._id, sprintName: sprint.sprintName, sprintGoals: sprint.sprintGoals || "", startDate: sprint.startDate || "", endDate: sprint.endDate || "",};
    } catch (err) {
        console.error('Error adding sprint to group:', err);
    }
}

async function addSprint(sprintData, boardId) {
    try {
        const sprintBoard = await Board.findById(boardId);
        const taskBoard = await Board.findOne({boardName:sprintBoard.boardName+"-Task"});
        const groupData = {groupName: sprintData.sprintName};
        const taskData = {taskName: "New Task"};
        const { itemId } = await addTask(taskData);
        const sprint = new Sprint(sprintData);
        await sprint.save();
        await addTaskGroup(taskBoard._id, groupData, itemId, sprint._id);
        return {itemId:sprint._id};
    } catch (err) {
        console.error('Error creating sprint:', err);
    }
}

async function removeSprintFromGroup(sprintId) {
    try {
        const sprint = await Sprint.findById(sprintId);
        if (!sprint) {
            console.log('Sprint not found');
        }
        let group = await Group.findOne({sprints:sprintId});
        if (!group) {
            console.log('Sprint Group not found');
        }
        group.sprints = group.sprints.filter((id) => id.toString() !== sprintId);
        await group.save();
        await Sprint.findByIdAndDelete(sprintId);
        await removeTaskGroup(sprint.connectedGroup.toString());
        group = await Group.findById(group._id).populate({
            path: 'sprints',
        });
        return {
            groupId: group._id,
            groupName: group.groupName,
            items: group.sprints.map((sprint) => ({
                itemId: sprint._id,
                sprintName: sprint.sprintName,
                sprintGoals: sprint.sprintGoals || "",
                startDate: sprint.startDate || "",
                endDate: sprint.endDate || "",
            })),
        };
    } catch (err) {
        console.error('Error removing sprint from group:', err);
    }
}

async function updateSprintInGroup(sprintData) {
    try {
        console.log(sprintData);
        const sprint = await Sprint.findById(sprintData._id);        
        if (!sprint) {
            console.log('Sprint not found');
        }
        const isSprintNameUpdated = sprintData.sprintName && sprintData.sprintName !== sprint.sprintName;
        const updatedSprint = await Sprint.findByIdAndUpdate(
            sprintData._id,
            { $set: sprintData },
            { new: true }
        );
        if (isSprintNameUpdated) {
            const taskGroup = await Group.findById(sprint.connectedGroup);
            if (taskGroup) {
                taskGroup.groupName = sprintData.sprintName;
                await taskGroup.save();
            } else {
                console.warn('Task group matching old sprintName not found');
            }
        }
        return updatedSprint;
    } catch (err) {
        console.error('Error updating sprint in group:', err);
    }
}

async function addMembersToDeveloper(itemId, userId, adminId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            console.log('Bug not found');
        }
        const userAlreadyAssigned = bug.developer.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this bug');
        }else{
            bug.developer.push(userId);
            await bug.save();
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
            }
            const person = await User.findById(adminId);
            const message = `Hello ${user.fullname},\n\nYou have been assigned as a Developer to the bug "${bug.bugName}" by ${person.fullname}. Please check the details and take the necessary actions.\n\nThank you!`;
            await sendNotification(user, message);
        }
        await bug.populate({
            path: 'developer',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.developer.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to bug:', err);
    }
}

async function removeMembersFromDeveloper(itemId, userId, adminId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            console.log('Bug not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = bug.developer.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this bug';
        }

        bug.developer.splice(userIndex, 1);

        await bug.save();
        const person = await User.findById(adminId);
        const message = `Hello ${user.fullname},\n\nYou have been removed as a Developer from the bug "${bug.bugName} by ${person.fullname}".\n\nThank you!`;
        await sendNotification(user, message);

        await bug.populate({
            path: 'developer',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.developer.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from bug:', err);
    }
}


// Bug Functions
async function addBugToGroup(groupId, bugData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            console.log('Group not found');
        }
        const bug = new Bug(bugData);
        await bug.save();
        group.bugs.push(bug._id);
        await group.save();
        const transformedReporter = Array.isArray(bug.reporter)
            ? bug.reporter.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        const transformedDeveloper = Array.isArray(bug.developer)
            ? bug.developer.map(assigned => ({
                  userId: assigned._id, 
                  email: assigned.email,
                  fullname: assigned.fullname,
              }))
            : null;
        return {itemId:bug._id, bugName: bug.bugName, reporter: transformedReporter, developer: transformedDeveloper, priority: bug.priority || "",status: bug.status || "",};
    } catch (err) {
        console.error('Error adding bug to group:', err);
    }
}

async function addBug(bugData) {
    try {
        const bug = new Bug(bugData);
        await bug.save();
        return {itemId:bug._id};
    } catch (err) {
        console.error('Error creating item:', err);
    }
}

async function removeBugFromGroup(bugId) {
    try {
        const bug = await Bug.findById(bugId);
        if (!bug) {
            console.log('bug not found');
        }
        let group = await Group.findOne({ bugs: bugId });
        if (!group) {
            console.log('Group containing the bug not found');
        }
        group.bugs = group.bugs.filter((id) => id.toString() !== bugId);
        await group.save();
        await Bug.findByIdAndDelete(bugId);
        group = await Group.findById(group._id).populate({
            path: 'bugs',
            populate: [
                {
                    path: 'reporter',
                    select: '_id email fullname',
                },
                {
                    path: 'developer',
                    select: '_id email fullname',
                },
            ],
        });
        return {
            groupId: group._id,
            groupName: group.groupName,
            items: group.bugs.map((bug) => ({
                itemId: bug._id,
                bugName: bug.bugName,
                reporter: bug.reporter.map((assigned) => ({
                    userId: assigned._id,
                    email: assigned.email,
                    fullname: assigned.fullname,
                })),
                developer: bug.developer.map((assigned) => ({
                    userId: assigned._id,
                    email: assigned.email,
                    fullname: assigned.fullname,
                })),
                priority: bug.priority || "",
                status: bug.status || "",
            })),
        };
    } catch (err) {
        console.error('Error removing bug from group:', err);
    }
}

async function updateBugInGroup(bugData, boardId, userId) {
    try {
        const bug = await Bug.findById(bugData._id);
        if (!bug) {
            console.log('Bug not found');
        }
        const isReporter = bug.reporter.some(reporterId => reporterId.toString() === userId);
        const isDeveloper = bug.developer.some(developerId => developerId.toString() === userId);
        
        const workspace = await Workspace.findOne({ boards: boardId });
        const isAdmin = workspace.members.some(member => 
            member.userId.toString() === userId.toString() && member.role === 'admin'
          );

        if (!isReporter && !isDeveloper && !isAdmin) {
            console.log('Permission denied: User cannot update this bug');
            return null;
        }
        bugData = {
            ...bugData,
            reporter: bugData.reporter.map(user => user.userId),
            developer: bugData.developer.map(user => user.userId),
        };
        const updatedBug = await Bug.findByIdAndUpdate(
            bugData._id,
            { $set: bugData },
            { new: true }
        );
        const person = await User.findById(userId);
        const users = await User.find({ _id: { $in: [...bugData.reporter, ...bugData.developer] } });
        const notificationPromises = users.map(async (user) => {
            const message = `${person.fullname} has updated the bug "${bug.bugName}". Please review the changes.`;
            await sendNotification(user, message);
        });
        await Promise.all(notificationPromises);
        return updatedBug;
    } catch (err) {
        console.error('Error updating bug in group:', err);
    }
}

async function addMembersToReporter(itemId, userId, adminId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            console.log('Bug not found');
        }
        const userAlreadyAssigned = bug.reporter.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            console.log('User is already assigned to this bug');
        }else{
            bug.reporter.push(userId);
            await bug.save();
            const user = await User.findById(userId);
            if (!user) {
                console.log('User not found');
            }
            const person = await User.findById(adminId);
            const message = `Hello ${user.fullname},\n\nYou have been assigned as the Reporter to the bug "${bug.bugName}" by "${person.fullname}". Please check the details and take the necessary actions.\n\nThank you!`;
            await sendNotification(user, message);
        }        
        await bug.populate({
            path: 'reporter',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.reporter.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to bug:', err);
    }
}

async function removeMembersFromReporter(itemId, userId, adminId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            console.log('Bug not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            console.log('User not found');
        }

        const userIndex = bug.reporter.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned as Reporter to this bug';
        }

        bug.reporter.splice(userIndex, 1);

        await bug.save();
        const person = await User.findById(adminId);
        const message = `Hello ${user.fullname},\n\nYou have been removed as Reporter from the bug "${bug.bugName} by ${person.fullname}".\n\nThank you!`;
        await sendNotification(user, message);

        await bug.populate({
            path: 'reporter',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.reporter.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from bug:', err);
    }
}

async function getWorkspacesWithTaskCounts(moduleId, userId, workspaceId) {
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
                        populate: [
                            {
                                path: 'tasks',
                                populate: {
                                    path: 'person',
                                    select: '_id email fullname',
                                },
                            },
                            {
                                path: 'bugs',
                                populate: [
                                    {
                                        path: 'reporter',
                                        select: '_id email fullname',
                                    },
                                    {
                                        path: 'developer',
                                        select: '_id email fullname',
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        });
        
        if (!module) {
            console.log('Module not found');
        }
        const filteredWorkspaces = module.workspaces.filter((workspace) =>
            workspace.members.some(member => member.userId.toString() === userId)
        );
        // console.log(filteredWorkspaces);
        const relevantWorkspaces = workspaceId
            ? filteredWorkspaces.filter(workspace => workspace._id.toString() === workspaceId)
            : filteredWorkspaces;

        const reporterData = relevantWorkspaces.map((workspace) => {
            let totalBugs = 0;
            let fixedBugs = 0;
            let inProgressBugs = 0;
            let pendingBugs = 0;
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.bugs.forEach((bug) => {
                        const isPersonMatch = bug.reporter.some(
                            (assigned) => assigned._id.toString() === userId
                        );
                        if (isPersonMatch) {
                            totalBugs++;
                            if (bug.status === 'Done') {
                                fixedBugs++;
                            } else if (bug.status === 'In Progress') {
                                inProgressBugs++;
                            } else {
                                pendingBugs++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalBugs,
                fixedBugs,
                pendingBugs,
                inProgressBugs,
            };
        });
        const developerData = relevantWorkspaces.map((workspace) => {
            let totalBugs = 0;
            let fixedBugs = 0;
            let inProgressBugs = 0;
            let pendingBugs = 0;
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.bugs.forEach((bug) => {
                        const isPersonMatch = bug.developer.some(
                            (assigned) => assigned._id.toString() === userId
                        );
                        if (isPersonMatch) {
                            totalBugs++;
                            if (bug.status === 'Done') {
                                fixedBugs++;
                            } else if (bug.status === 'In Progress') {
                                inProgressBugs++;
                            } else {
                                pendingBugs++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalBugs,
                fixedBugs,
                pendingBugs,
                inProgressBugs,
            };
        });
        const taskData = relevantWorkspaces.map((workspace) => {
            let totalTasks = 0;
            let completedTasks = 0;
            let inProgressTasks = 0;
            let pendingTasks = 0;
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        const isPersonMatch = task.person.some(
                            (assigned) => assigned._id.toString() === userId
                        );
                        if (isPersonMatch) {
                            totalTasks++;
                            if (task.status === 'Done') {
                                completedTasks++;
                            } else if (task.status === 'In Progress') {
                                inProgressTasks++;
                            } else {
                                pendingTasks++;
                            }
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
            };
        });
        return {
            type:"dev",
            taskStats: taskData,
            reporterStats: reporterData,
            developerStats: developerData
        };
    } catch (err) {
        console.error('Error fetching workspaces with task counts:', err);
    }
}


module.exports = {
    getBugBoard,
    addBugGroup,
    removeBugGroup,
    getSprintBoard,
    addSprintGroup,
    removeSprintGroup,
    getTaskBoard,
    addTaskGroup,
    removeTaskGroup,
    addTaskToGroup,
    addTask,
    removeTaskFromGroup,
    updateTaskInGroup,
    addMembersToTask,
    removeMembersFromTask,
    addSprintToGroup,
    addSprint,
    removeSprintFromGroup,
    updateSprintInGroup,
    addMembersToDeveloper,
    removeMembersFromDeveloper,
    addBugToGroup,
    addBug,
    removeBugFromGroup,
    updateBugInGroup,
    addMembersToReporter,
    removeMembersFromReporter,
    getWorkspacesWithTaskCounts,
};