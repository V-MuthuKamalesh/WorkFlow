const express = require('express');
const devController = require('../controllers/devcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Task events
        socket.on('addTaskToGroup', async (data, callback) => {
            const { groupId, task } = data;
            const updatedGroup = await devController.addTaskToGroup(groupId, task);
            callback(updatedGroup);
        });

        socket.on('createTask', async (data, callback) => {
            const { task } = data;
            const taskData = await devController.addTask(task);
            callback(taskData);
        });

        socket.on('removeTaskFromGroup', async (data, callback) => {
            const { taskId } = data;
            const updatedGroup = await devController.removeTaskFromGroup(taskId);
            callback(updatedGroup);
        });

        socket.on('updateTaskInGroup', async (data, callback) => {
            const { taskId, updateData } = data;
            const updatedItem = await devController.updateTaskInGroup(taskId, updateData);
            callback(updatedItem);
        });

        // Sprint events
        socket.on('addSprintToGroup', async (data, callback) => {
            const { groupId, sprint } = data;
            const updatedGroup = await devController.addSprintToGroup(groupId, sprint);
            callback(updatedGroup);
        });

        socket.on('createSprint', async (data, callback) => {
            const { sprint } = data;
            const sprintData = await devController.addSprint(sprint);
            callback(sprintData);
        });

        socket.on('removeSprintFromGroup', async (data, callback) => {
            const { sprintId } = data;
            const updatedGroup = await devController.removeSprintFromGroup(sprintId);
            callback(updatedGroup);
        });

        socket.on('updateSprintInGroup', async (data, callback) => {
            const { sprintId, updateData } = data;
            const updatedItem = await devController.updateSprintInGroup(sprintId, updateData);
            callback(updatedItem);
        });

        // Bug events
        socket.on('addBugToGroup', async (data, callback) => {
            const { groupId, bug } = data;
            const updatedGroup = await devController.addBugToGroup(groupId, bug);
            callback(updatedGroup);
        });

        socket.on('createSprint', async (data, callback) => {
            const { sprint } = data;
            const sprintData = await devController.addSprint(sprint);
            callback(sprintData);
        });

        socket.on('removeBugFromGroup', async (data, callback) => {
            const { bugId } = data;
            const updatedGroup = await devController.removeBugFromGroup(bugId);
            callback(updatedGroup);
        });

        socket.on('updateBugInGroup', async (data, callback) => {
            const { bugId, updateData } = data;
            const updatedItem = await devController.updateBugInGroup(bugId, updateData);
            callback(updatedItem);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return router;
};
