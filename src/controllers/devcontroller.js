const devService = require('../services/devservice');

//Task
async function addTaskToGroup(groupId, taskData) {
    try {
        const updatedGroup = await devService.addTaskToGroup(groupId, taskData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add task to group'+ err.message );
    }
}

async function addTask(taskData) {
    try {
        const task = await workService.addTask(taskData);
        return task;
    } catch (err) {
        console.log('Failed to create task '+ err.message );
    }
}

async function removeTaskFromGroup(taskId) {
    try {
        const updatedGroup = await devService.removeTaskFromGroup(taskId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove task from group' + err.message );
    }
}

async function updateTaskInGroup(taskId, taskData) {
    try {
        taskData._id=taskId;
        const updatedTask = await devService.updateTaskInGroup(taskData);
        return updatedTask;
    } catch (err) {
        console.log('Failed to update task in group'+err.message );
    }
}

// Sprint
async function addSprintToGroup(groupId, sprintData) {
    try {
        const updatedGroup = await devService.addSprintToGroup(groupId, sprintData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add sprint to group'+ err.message );
    }
}

async function addSprint(sprintData) {
    try {
        const sprint = await workService.addSprint(sprintData);
        return sprint;
    } catch (err) {
        console.log('Failed to create sprint '+ err.message );
    }
}

async function removeSprintFromGroup(sprintId) {
    try {
        const updatedGroup = await devService.removeSprintFromGroup(sprintId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove sprint from group' + err.message );
    }
}

async function updateSprintInGroup(sprintId, sprintData) {
    try {
        sprintData._id=sprintId;
        const updatedSprint = await devService.updateSprintInGroup(sprintData);
        return updatedSprint;
    } catch (err) {
        console.log('Failed to update sprint in group'+err.message );
    }
}

// Bug
async function addBugToGroup(groupId, bugData) {
    try {
        const updatedGroup = await devService.addBugToGroup(groupId, bugData);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to add bug to group'+ err.message );
    }
}

async function addBug(itemData) {
    try {
        const bug = await workService.addBug(itemData);
        return bug;
    } catch (err) {
        console.log('Failed to create bug '+ err.message );
    }
}

async function removeBugFromGroup(bugId) {
    try {
        const updatedGroup = await devService.removeBugFromGroup(bugId);
        return updatedGroup;
    } catch (err) {
        console.log('Failed to remove bug from group' + err.message );
    }
}

async function updateBugInGroup(bugId, bugData) {
    try {
        bugData._id=bugId;
        const updatedBug = await devService.updateBugInGroup(bugData);
        return updatedBug;
    } catch (err) {
        console.log('Failed to update bug in group'+err.message );
    }
}


module.exports = {
    addTaskToGroup,
    addTask,
    removeTaskFromGroup,
    updateTaskInGroup,
    addSprintToGroup,
    addSprint,
    removeSprintFromGroup,
    updateSprintInGroup,
    addBugToGroup,
    addBug,
    removeBugFromGroup,
    updateBugInGroup,
};