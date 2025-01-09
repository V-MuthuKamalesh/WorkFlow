const express = require('express');
const devController = require('../controllers/devcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspaces', async (_, callback) => {
            const workspaces = await devController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const { id } = data;
            const workspace = await devController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const workspace = await devController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await devController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const { id } = data;
            const result = await devController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspace', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await devController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await devController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await devController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await devController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await devController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await devController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await devController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await devController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

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
