const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in dev');

        // Work-related events
        socket.on('getWorkspaces', async (_, callback) => {
            const workspaces = await serviceController.getWorkspaces();
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const { id } = data;
            const workspace = await serviceController.getWorkspaceById(id);
            callback(workspace);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const workspace = await serviceController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await serviceController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const { id } = data;
            const result = await serviceController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspace', async (data, callback) => {
            const { id, members } = data;
            const updatedWorkspace = await serviceController.addMemberToWorkspace(id, members);
            callback(updatedWorkspace);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await serviceController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await serviceController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await serviceController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await serviceController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await serviceController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await serviceController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await serviceController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Task events
        socket.on('addTaskToGroup', async (data, callback) => {
            const { groupId, task } = data;
            const updatedGroup = await serviceController.addTaskToGroup(groupId, task);
            callback(updatedGroup);
        });

        socket.on('createTask', async (data, callback) => {
            const { task } = data;
            const taskData = await serviceController.addTask(task);
            callback(taskData);
        });

        socket.on('removeTaskFromGroup', async (data, callback) => {
            const { taskId } = data;
            const updatedGroup = await serviceController.removeTaskFromGroup(taskId);
            callback(updatedGroup);
        });

        socket.on('updateTaskInGroup', async (data, callback) => {
            const { taskId, updateData } = data;
            const updatedItem = await serviceController.updateTaskInGroup(taskId, updateData);
            callback(updatedItem);
        });

        // Sprint events
        socket.on('addSprintToGroup', async (data, callback) => {
            const { groupId, sprint } = data;
            const updatedGroup = await serviceController.addSprintToGroup(groupId, sprint);
            callback(updatedGroup);
        });

        socket.on('createSprint', async (data, callback) => {
            const { sprint } = data;
            const sprintData = await serviceController.addSprint(sprint);
            callback(sprintData);
        });

        socket.on('removeSprintFromGroup', async (data, callback) => {
            const { sprintId } = data;
            const updatedGroup = await serviceController.removeSprintFromGroup(sprintId);
            callback(updatedGroup);
        });

        socket.on('updateSprintInGroup', async (data, callback) => {
            const { sprintId, updateData } = data;
            const updatedItem = await serviceController.updateSprintInGroup(sprintId, updateData);
            callback(updatedItem);
        });

        // Bug events
        socket.on('addBugToGroup', async (data, callback) => {
            const { groupId, bug } = data;
            const updatedGroup = await serviceController.addBugToGroup(groupId, bug);
            callback(updatedGroup);
        });

        socket.on('createSprint', async (data, callback) => {
            const { sprint } = data;
            const sprintData = await serviceController.addSprint(sprint);
            callback(sprintData);
        });

        socket.on('removeBugFromGroup', async (data, callback) => {
            const { bugId } = data;
            const updatedGroup = await serviceController.removeBugFromGroup(bugId);
            callback(updatedGroup);
        });

        socket.on('updateBugInGroup', async (data, callback) => {
            const { bugId, updateData } = data;
            const updatedItem = await serviceController.updateBugInGroup(bugId, updateData);
            callback(updatedItem);
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return router;
};
