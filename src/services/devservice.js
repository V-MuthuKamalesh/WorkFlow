const { User, Board, Group, Task, Sprint, Bug } = require('../models/schema'); 

async function getBugBoard(boardId) {
    try {
        const board = await Board.findById(boardId)
            .populate({
                path: 'groups',
                populate: {
                    path: 'bugs',
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
                items: group.bugs.map((bug) => {
                    return {
                        itemId: bug._id,
                        bugName: bug.bugName,
                        reporter: bug.reporter || [],
                        developer: bug.developer || [],
                        priority: bug.priority || "",
                        status: bug.status || "",
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
async function addBugGroup(boardId, groupData, itemId) {
    try {
        const board = await Board.findById(boardId);
        if (!board) {
            throw new Error('Board not found');
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
                    path: 'bugs',
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
            throw new Error('Board not found');
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
                    path: 'sprints',
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
            type: board.type || "",
            workspaceName: board.workspaceName,
            groups: board.groups.map((group) => ({
                groupId: group._id,
                groupName: group.groupName,
                items: group.tasks.map((task) => {
                    const transformedAssignedTo = Array.isArray(task.assignedToId)
                        ? task.assignedToId.map((assigned) => ({
                              userId: assigned._id, 
                              email: assigned.email,
                              fullname: assigned.fullname,
                          }))
                        : null;
                    return {
                        itemId: task._id,
                        taskName: task.taskName,
                        assignedToId: transformedAssignedTo, 
                        status: task.status || "",
                        dueDate: task.dueDate || "",
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
            throw new Error('Board not found');
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
                items: group.tasks.map((task) => ({
                    itemId: task._id,
                    taskName: task.taskName,
                    assignedToId: task.assignedToId,
                    status: task.status || "",
                    dueDate: task.dueDate || "",
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
                    path: 'tasks',
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
                items: group.tasks.map((task) => ({
                    itemId: task._id,
                    taskName: task.taskName,
                    assignedToId: task.assignedToId,
                    status: task.status || "",
                    dueDate: task.dueDate || "",
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
            throw new Error('Group not found');
        }
        const task = new Task(taskData);
        await task.save();
        group.tasks.push(task._id);
        await group.save();
        return group;
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
            throw new Error('task not found');
        }
        const group = await Group.findOne({ tasks: taskId });
        if (!group) {
            throw new Error('Group containing the task not found');
        }
        group.tasks = group.tasks.filter((id) => id.toString() !== taskId);
        await group.save();
        await Task.findByIdAndDelete(taskId);
        return group;
    } catch (err) {
        console.error('Error removing task from group:', err);
        throw { error: 'Failed to remove task from group', details: err.message };
    }
}

async function updateTaskInGroup(taskData) {
    try {
        const task = await task.findById(taskData._id);
        if (!task) {
            throw new Error('task not found');
        }
        const updatedTask = await task.findByIdAndUpdate(
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
            throw new Error('Task not found');
        }
        const userAlreadyAssigned = task.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this task');
        }
        task.assignedToId.push(userId);
        await task.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the task "${task.taskName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await task.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = task.assignedToId.map((assignedUser) => ({
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
            throw new Error('Task not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = task.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this task';
        }

        task.assignedToId.splice(userIndex, 1);

        await task.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the task "${task.taskName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await task.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = task.assignedToId.map((assignedUser) => ({
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
async function addSprintToGroup(groupId, sprintData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const sprint = new Sprint(sprintData);
        await sprint.save();
        group.sprints.push(sprint._id);
        await group.save();
        return group;
    } catch (err) {
        console.error('Error adding sprint to group:', err);
        throw { error: 'Failed to add sprint to group', details: err.message };
    }
}

async function addSprint(sprintData) {
    try {
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
            throw new Error('Sprint not found');
        }
        const group = await Group.findOne({ sprints: sprintId });
        if (!group) {
            throw new Error('Group containing the sprint not found');
        }
        group.sprints = group.sprints.filter((id) => id.toString() !== sprintId);
        await group.save();
        await Sprint.findByIdAndDelete(sprintId);
        return group;
    } catch (err) {
        console.error('Error removing sprint from group:', err);
        throw { error: 'Failed to remove sprint from group', details: err.message };
    }
}

async function updateSprintInGroup(sprintData) {
    try {
        const sprint = await Sprint.findById(sprintData._id);
        if (!sprint) {
            throw new Error('Sprint not found');
        }
        const updatedSprint = await Sprint.findByIdAndUpdate(
            sprintData._id,
            { $set: sprintData },
            { new: true }
        );
        return updatedSprint;
    } catch (err) {
        console.error('Error updating sprint in group:', err);
        throw { error: 'Failed to update sprint in group', details: err.message };
    }
}

async function addMembersToSprint(itemId, userId) {
    try {
        const sprint = await Sprint.findById(itemId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }
        const userAlreadyAssigned = sprint.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this sprint');
        }
        sprint.assignedToId.push(userId);
        await sprint.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the sprint "${sprint.sprintName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await sprint.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = sprint.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error adding members to sprint:', err);
        throw err;
    }
}

async function removeMembersFromSprint(itemId, userId) {
    try {
        const sprint = await Sprint.findById(itemId);
        if (!sprint) {
            throw new Error('Sprint not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = sprint.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this sprint';
        }

        sprint.assignedToId.splice(userIndex, 1);

        await sprint.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the sprint "${sprint.sprintName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await sprint.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = sprint.assignedToId.map((assignedUser) => ({
            userId: assignedUser._id,
            email: assignedUser.email,
            fullname: assignedUser.fullname,
        }));

        return { assignedToId: transformedAssignedTo };
    } catch (err) {
        console.error('Error removing members from sprint:', err);
        throw err;
    }
}


// Bug Functions
async function addBugToGroup(groupId, bugData) {
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            throw new Error('Group not found');
        }
        const bug = new Bug(bugData);
        await bug.save();
        group.bugs.push(bug._id);
        await group.save();
        return group;
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
            throw new Error('bug not found');
        }
        const group = await Group.findOne({ bugs: bugId });
        if (!group) {
            throw new Error('Group containing the bug not found');
        }
        group.bugs = group.bugs.filter((id) => id.toString() !== bugId);
        await group.save();
        await Bug.findByIdAndDelete(bugId);
        return group;
    } catch (err) {
        console.error('Error removing bug from group:', err);
        throw { error: 'Failed to remove bug from group', details: err.message };
    }
}

async function updateBugInGroup(bugData) {
    try {
        const bug = await Bug.findById(bugData._id);
        if (!bug) {
            throw new Error('Bug not found');
        }
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

async function addMembersToBug(itemId, userId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            throw new Error('Bug not found');
        }
        const userAlreadyAssigned = bug.assignedToId.some(
            (id) => id.toString() === userId
        );
        if (userAlreadyAssigned) {
            throw new Error('User is already assigned to this bug');
        }
        bug.assignedToId.push(userId);
        const updatedItem = await bug.save();
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const message = `Hello ${user.fullname},\n\nYou have been assigned to the bug "${bug.bugName}". Please check the details and take necessary actions.\n\nThank you!`;
        await sendSlackNotification(user.email, message);
        await bug.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.assignedToId.map((assignedUser) => ({
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

async function removeMembersFromBug(itemId, userId) {
    try {
        const bug = await Bug.findById(itemId);
        if (!bug) {
            throw new Error('Bug not found');
        }

        let user = await User.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        const userIndex = bug.assignedToId.findIndex(
            (id) => id.toString() === user._id.toString()
        );

        if (userIndex === -1) {
            return 'User is not assigned to this bug';
        }

        bug.assignedToId.splice(userIndex, 1);

        await bug.save();

        const message = `Hello ${user.fullname},\n\nYou have been removed from the bug "${bug.bugName}".\n\nThank you!`;
        await sendSlackNotification(user.email, message);

        await bug.populate({
            path: 'assignedToId',
            select: '_id email fullname',
        });

        const transformedAssignedTo = bug.assignedToId.map((assignedUser) => ({
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
    addMembersToSprint,
    removeMembersFromSprint,
    addBugToGroup,
    addBug,
    removeBugFromGroup,
    updateBugInGroup,
    addMembersToBug,
    removeMembersFromBug,
};