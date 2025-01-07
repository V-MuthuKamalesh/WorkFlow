const { Group, Task, Sprint, Bug } = require('../models/schema'); 
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

module.exports = {
    addTaskToGroup,
    removeTaskFromGroup,
    updateTaskInGroup,
    addSprintToGroup,
    removeSprintFromGroup,
    updateSprintInGroup,
    addBugToGroup,
    removeBugFromGroup,
    updateBugInGroup,
};