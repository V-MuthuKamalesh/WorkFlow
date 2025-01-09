const express = require('express');
const workController = require('../controllers/workcontroller');

const router = express.Router();

module.exports = (io) => {

    io.on('connection', (socket) => {
        console.log('A user connected in Workmanagement');

        // Work-related events
        socket.on('getWorkspaces', async (data, callback) => {
            const {token} = data;
            const workspaces = await workController.getWorkspaces(token);
            callback(workspaces);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const {id}=data;
            const workspace = await workController.getWorkspaceById(id);
            callback(workspace);
        });
        
        socket.on('getWorkspaceDetailsById', async (data, callback) => {
            const {id}=data;
            const workspace = await workController.getWorkspaceDetailsById(id);
            callback(workspace);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const workspace = await workController.createWorkspace(data);
            callback(workspace);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData } = data;
            const updatedWorkspace = await workController.updateWorkspace(id, updateData);
            callback(updatedWorkspace);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const  {id}  = data;
            const result = await workController.deleteWorkspace(id);
            callback(result);
        });

        socket.on('addMemberToWorkspace', async (data, callback) => {
            const { id, members, token } = data;
            const response = await workController.addMemberToWorkspace(id, members, token);
            callback(response);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await workController.addBoardToWorkspace(id, board);
            callback(updatedWorkspace);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await workController.removeBoardFromWorkspace(boardId);
            callback(updatedWorkspace);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await workController.updateBoardInWorkspace(boardId, updateData);
            callback(updatedBoard);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await workController.getBoardById(boardId);
            callback(board);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group } = data;
            const updatedBoard = await workController.addGroupToBoard(boardId, group);
            callback(updatedBoard);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId } = data;
            const updatedBoard = await workController.removeGroupFromBoard(groupId);
            callback(updatedBoard);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await workController.updateGroupInBoard(groupId, updateData);
            callback(updatedGroup);
        });

        // Item events
        socket.on('addItemToGroup', async (data, callback) => {
            const { groupId, item } = data;
            const updatedGroup = await workController.addItemToGroup(groupId, item);
            callback(updatedGroup);
        });

        socket.on('addItem', async (data, callback) => {
            const { item } = data;
            const itemData = await workController.addItemToGroup(item);
            callback(itemData);
        });

        socket.on('removeItemFromGroup', async (data, callback) => {
            const { itemId } = data;
            const updatedGroup = await workController.removeItemFromGroup(itemId);
            callback(updatedGroup);
        });

        socket.on('updateItemInGroup', async (data, callback) => {
            const { itemId, updateData } = data;
            const updatedItem = await workController.updateItemInGroup(itemId, updateData);
            callback(updatedItem);
        });

        socket.on('addMembersToItem', async (data, callback) => {
            const { itemId, userId } = data;
            const updatedItem = await workController.addMembersToItem(itemId, userId);
            callback(updatedItem);
        });

        socket.on('removeMembersFromItem', async (data, callback) => {
            const { itemId, userId } = data;
            try {
                const updatedItem = await workController.removeMembersFromItem(itemId, userId);
                callback(updatedItem);
            } catch (err) {
                callback({ error: err.message });
            }
        });        

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    return router;
};
