const { User, Module, Board, Group, Task, Sprint, Bug } = require('../models/schema'); 
const { sendSlackNotification } = require('../utils/slack');

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
        throw { error: 'Failed to fetch board', details: err.message };
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
        throw { error: 'Failed to add group to board', details: err.message };
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
        throw { error: 'Failed to remove group', details: err.message };
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
        throw { error: 'Failed to fetch board', details: err.message };
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
        throw { error: 'Failed to add group to board', details: err.message };
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
        throw { error: 'Failed to remove group', details: err.message };
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
        throw { error: 'Failed to fetch board', details: err.message };
    }
}


// Group Functions
async function addTaskGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            console.log('Board not found');
        }
        groupData.tasks=[itemId];
        groupData.boardId = boardId;
        const group = new Group(groupData);
        await group.save();
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
        throw { error: 'Failed to add group to board', details: err.message };
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
        console.error('Error removing group from board:', err);
        throw { error: 'Failed to remove group', details: err.message };
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
        throw { error: 'Failed to add task to group', details: err.message };
    }
}

async function addTask(taskData) {
    try {
        const task = new Task(taskData);
        await task.save();
        return {itemId:task._id};
    } catch (err) {
        console.error('Error creating task:', err);
        throw { error: 'Failed to create task ', details: err.message };
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
        throw { error: 'Failed to remove task from group', details: err.message };
    }
}

async function updateTaskInGroup(taskData) {
    try {
        const task = await Task.findById(taskData._id);
        if (!task) {
            console.log('task not found');
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
        return updatedTask;
    } catch (err) {
        console.error('Error updating task in group:', err);
        throw { error: 'Failed to update task in group', details: err.message };
    }
}

async function addMembersToTask(itemId, userId) {
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
        if (!user) {
            console.log('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the task "${task.taskName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
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
        throw err;
    }
}

async function removeMembersFromTask(itemId, userId) {
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

        const message = `Hello ${user.fullname},\n\nYou have been removed from the task "${task.taskName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

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
        throw err;
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
        await addTaskGroup(taskBoard._id, groupData, itemId);
        const sprint = new Sprint(sprintData);
        await sprint.save();
        group.sprints.push(sprint._id);
        await group.save();
        return {itemId:sprint._id, sprintName: sprint.sprintName, sprintGoals: sprint.sprintGoals || "", startDate: sprint.startDate || "", endDate: sprint.endDate || "",};
    } catch (err) {
        console.error('Error adding sprint to group:', err);
        throw { error: 'Failed to add sprint to group', details: err.message };
    }
}

async function addSprint(sprintData, boardId) {
    try {
        const sprintBoard = await Board.findById(boardId);
        const taskBoard = await Board.findOne({boardName:sprintBoard.boardName+"-Task"});
        const groupData = {groupName: sprintData.sprintName};
        const taskData = {taskName: "New Task"};
        const { itemId } = await addTask(taskData);
        await addTaskGroup(taskBoard._id, groupData, itemId);
        const sprint = new Sprint(sprintData);
        await sprint.save();
        return {itemId:sprint._id};
    } catch (err) {
        console.error('Error creating sprint:', err);
        throw { error: 'Failed to create sprint ', details: err.message };
    }
}

async function removeSprintFromGroup(sprintId) {
    try {
        const sprint = await Sprint.findById(sprintId);
        if (!sprint) {
            console.log('Sprint not found');
        }
        let group = await Group.findOne({ sprints: sprintId });
        if (!group) {
            console.log('Group containing the sprint not found');
        }
        const sprintBoard = await Board.findOne({ groups: group._id });
        if (!sprintBoard) {
            console.log('Sprint board not found');
        }
        const taskBoard = await Board.findOne({ boardName: sprintBoard.boardName + "-Task" });
        if (!taskBoard) {
            console.log('Task board containing the sprint group not found');
        }
        const taskGroup = await Group.findOne({ groupName: sprint.sprintName, boardId: taskBoard._id });
        if (!taskGroup) {
            console.log('Task group associated with sprint not found');
        }
        await removeTaskGroup(taskGroup._id);
        group.sprints = group.sprints.filter((id) => id.toString() !== sprintId);
        await group.save();
        await Sprint.findByIdAndDelete(sprintId);
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
        throw { error: 'Failed to remove sprint from group', details: err.message };
    }
}

async function updateSprintInGroup(sprintData, boardId) {
    try {
        console.log(sprintData);
        const sprint = await Sprint.findById(sprintData._id);
        console.log(sprint);
        
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
            const sprintBoard = await Board.findById(boardId);
            if (!sprintBoard) {
                console.log('Sprint board not found');
            }
            const taskBoard = await Board.findOne({ boardName: sprintBoard.boardName + "-Task" });
            if (!taskBoard) {
                console.log('Task board not found');
            }
            const taskGroup = await Group.findOne({ groupName: sprint.sprintName, boardId: taskBoard._id });
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
        throw { error: 'Failed to update sprint in group', details: err.message };
    }
}

async function addMembersToDeveloper(itemId, userId) {
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
        }
        bug.developer.push(userId);
        await bug.save();
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned as a Developer to the bug "${bug.bugName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
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
        throw err;
    }
}

async function removeMembersFromDeveloper(itemId, userId) {
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

        const message = `Hello ${user.fullname},\n\nYou have been removed as a Developer from the bug "${bug.bugName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

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
        throw err;
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
        throw { error: 'Failed to add bug to group', details: err.message };
    }
}

async function addBug(bugData) {
    try {
        const bug = new Bug(bugData);
        await bug.save();
        return {itemId:bug._id};
    } catch (err) {
        console.error('Error creating item:', err);
        throw { error: 'Failed to create item ', details: err.message };
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
        throw { error: 'Failed to remove bug from group', details: err.message };
    }
}

async function updateBugInGroup(bugData) {
    try {

        const bug = await Bug.findById(bugData._id);
        if (!bug) {
            console.log('Bug not found');
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
        return updatedBug;
    } catch (err) {
        console.error('Error updating bug in group:', err);
        throw { error: 'Failed to update bug in group', details: err.message };
    }
}

async function addMembersToReporter(itemId, userId) {
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
        }
        bug.reporter.push(userId);
        await bug.save();
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned as Reporterto the bug "${bug.bugName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
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
        throw err;
    }
}

async function removeMembersFromReporter(itemId, userId) {
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

        const message = `Hello ${user.fullname},\n\nYou have been removed as Reporter from the bug "${bug.bugName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

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
        throw err;
    }
}

async function getWorkspacesWithTaskCounts(moduleId, userId) {
    try {
        const module = await Module.findById(moduleId).populate({
            path: 'workspaces',
            populate: {
                path: 'boards',
                populate: {
                    path: 'groups',
                    populate: {
                        path: 'tasks',
                        populate: {
                            path: 'person',
                            select: '_id',
                        },
                    },
                },
            },
        });
        if (!module) {
            throw new Error('Module not found');
        }
        const result = module.workspaces.map((workspace) => {
            let totalAssignedTasks = 0;
            const statusCounts = {
                "Ready to start": 0,
                "In Progress": 0,
                "Waiting for review": 0,
                "Pending Deploy": 0,
                "Done": 0,
                "Stuck": 0,
            };
            const priorityCounts = {
                Low: 0,
                Medium: 0,
                High: 0,
                Critical: 0,
            };
            workspace.boards.forEach((board) => {
                board.groups.forEach((group) => {
                    group.tasks.forEach((task) => {
                        if (
                            Array.isArray(task.person) &&
                            task.person.some((assigned) => assigned._id.toString() === userId)
                        ) {
                            totalAssignedTasks++;
                        }
                        if (statusCounts.hasOwnProperty(task.status)) {
                            statusCounts[task.status]++;
                        }
                        if (priorityCounts.hasOwnProperty(task.priority)) {
                            priorityCounts[task.priority]++;
                        }
                    });
                });
            });
            return {
                workspaceName: workspace.workspaceName,
                totalAssignedTasks,
                statusCounts,
                priorityCounts,
            };
        });
        return result;
    } catch (err) {
        console.error('Error fetching workspaces with task counts:', err);
        throw { error: 'Failed to fetch workspaces with task counts', details: err.message };
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