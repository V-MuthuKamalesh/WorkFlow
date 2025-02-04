const express = require('express');
const workspaceController = require('../controllers/workspacecontroller');
const { socketAuthMiddleware } = require('../middlewares/auth');
const router = express.Router();

module.exports = (io) => {
    const userSockets = {}; 
    io.use(socketAuthMiddleware);

    io.on('connection', (socket) => {
        console.log('A user connected');
        const adminId = socket.userId;
        userSockets[socket.userId] = socket.id;
        const emitResponse = (eventName, data, callback) => {
            io.emit(eventName, data); 
            callback(data); 
        };

        // Workspace events
        socket.on('getWorkspaces', async (data, callback) => {
            const { moduleId } = data;
            const workspaces = await workspaceController.getWorkspaces(adminId, moduleId);
            emitResponse('getWorkspaces', workspaces, callback);
        });

        socket.on('getDashboardDetails', async (data, callback) => {
            const { moduleId, userId, workspaceId } = data;
            const workspaces = await workspaceController.getWorkspacesWithItemCounts(userId, moduleId, workspaceId);
            emitResponse('getDashboardDetails', workspaces, callback);
        });

        socket.on('getBoardsByWorkspaceById', async (data, callback) => {
            const { id } = data;
            const workspace = await workspaceController.getWorkspaceById(id);
            emitResponse('getBoardsByWorkspaceById', workspace, callback);
        });

        socket.on('getWorkspaceDetailsById', async (data, callback) => {
            const { id } = data;
            const workspace = await workspaceController.getWorkspaceDetailsById(id);
            emitResponse('getWorkspaceDetailsById', workspace, callback);
        });

        socket.on('createWorkspace', async (data, callback) => {
            const { moduleId, workspaceData } = data;
            workspaceData.moduleId = moduleId;
            const workspace = await workspaceController.createWorkspace(workspaceData, moduleId, adminId);
            emitResponse('workspacesUpdated', workspace, callback);
        });

        socket.on('updateWorkspaceById', async (data, callback) => {
            const { id, updateData, moduleId } = data;
            const updatedWorkspace = await workspaceController.updateWorkspace(id, updateData, moduleId, adminId);
            emitResponse('workspacesUpdated', updatedWorkspace.all, callback);
            emitResponse('workspaceNameUpdated', updatedWorkspace.workspace, callback);
        });

        socket.on('deleteWorkspaceById', async (data, callback) => {
            const { id, moduleId } = data;
            const result = await workspaceController.deleteWorkspace(id, moduleId, adminId);
            emitResponse('workspacesUpdated', result, callback);
            emitResponse('workspaceDeleted',id,callback);
        });

        // Board events
        socket.on('addBoardToWorkspace', async (data, callback) => {
            const { id, board } = data;
            const updatedWorkspace = await workspaceController.addBoardToWorkspace(id, board);
            emitResponse('boardAdded', updatedWorkspace, callback);
        });

        socket.on('removeBoardFromWorkspace', async (data, callback) => {
            const { boardId } = data;
            const updatedWorkspace = await workspaceController.removeBoardFromWorkspace(boardId);
            emitResponse('boardRemoved', updatedWorkspace, callback);
        });

        socket.on('updateBoardInWorkspace', async (data, callback) => {
            const { boardId, updateData } = data;
            const updatedBoard = await workspaceController.updateBoardInWorkspace(boardId, updateData);
            emitResponse('updateBoardInWorkspace', updatedBoard, callback);
        });

        socket.on('getBoardById', async (data, callback) => {
            const { boardId } = data;
            const board = await workspaceController.getBoardById(boardId);
            emitResponse('getBoardById', board, callback);
        });

        // Group events
        socket.on('addGroupToBoard', async (data, callback) => {
            const { boardId, group, itemId } = data;
            const updatedBoard = await workspaceController.addGroupToBoard(boardId, group, itemId);
            emitResponse('addGroupToBoard', updatedBoard, callback);
        });

        socket.on('removeGroupFromBoard', async (data, callback) => {
            const { groupId, type } = data;
            const updatedBoard = await workspaceController.removeGroupFromBoard(groupId, type);
            emitResponse('removeGroupFromBoard', updatedBoard, callback);
        });

        socket.on('updateGroupInBoard', async (data, callback) => {
            const { groupId, updateData } = data;
            const updatedGroup = await workspaceController.updateGroupInBoard(groupId, updateData);
            emitResponse('updateGroupInBoard', updatedGroup, callback);
        });

        // Item events
        socket.on('addItemToGroup', async (data, callback) => {
            const { groupId, item, type, boardId } = data;
            const updatedGroup = await workspaceController.addItemToGroup(groupId, item, type, boardId);
            emitResponse('addItemToGroup', updatedGroup, callback);
        });

        socket.on('createItem', async (data, callback) => {
            const { item, type, boardId } = data;
            const itemData = await workspaceController.addItem(item, type, boardId);
            emitResponse('createItem', itemData, callback);
        });

        socket.on('removeItemFromGroup', async (data, callback) => {
            const { itemId, type } = data;
            const updatedGroup = await workspaceController.removeItemFromGroup(itemId, type);
            emitResponse('removeItemFromGroup', updatedGroup.item, callback);
            if (updatedGroup.users && updatedGroup.notifications) {
                updatedGroup.users.forEach((user, index) => {
                    if (userSockets[user]) {
                        io.to(userSockets[user]).emit("newNotification", updatedGroup.notifications[index]);
                    }
                });
            }
        });

        socket.on('updateItemInGroup', async (data, callback) => {
            const { itemId, updateData, type, boardId } = data;
            const updatedItem = await workspaceController.updateItemInGroup(itemId, updateData, type, boardId, adminId);
            emitResponse('updateItemInGroup', updatedItem.item, callback);
            if(updatedItem.message) emitResponse('newNotification', updatedItem.message, callback);
        });

        socket.on('addMembersToItem', async (data, callback) => {
            const { itemId, userId, type } = data;
            const updatedItem = await workspaceController.addMembersToItem(itemId, userId, type, adminId);
            emitResponse('addMembersToItem', updatedItem.item, callback);
            if (userSockets[userId]) {
                io.to(userSockets[userId]).emit("newNotification", updatedItem.message);
            }
        });

        socket.on('removeMembersFromItem', async (data, callback) => {
            const { itemId, userId, type } = data;
            try {
                const updatedItem = await workspaceController.removeMembersFromItem(itemId, userId, type, adminId);
                emitResponse('removeMembersFromItem', updatedItem.item, callback);
                if (userSockets[userId]) {
                    io.to(userSockets[userId]).emit("newNotification", updatedItem.message);
                }
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('addFavouriteWorkspace', async (data, callback) => {
            const { workspaceId, type } = data;
            try {
                const updatedFavourite = await workspaceController.addFavouriteWorkspace(workspaceId, type);
                emitResponse('addFavouriteWorkspace', updatedFavourite, callback);
            } catch (err) {
                console.log({ error: err.message });
            }
        });

        socket.on('removeFavouriteWorkspace', async (data, callback) => {
            const { workspaceId, type } = data;
            try {
                const updatedFavourite = await workspaceController.removeFavouriteWorkspace(workspaceId, type);
                emitResponse('removeFavouriteWorkspace', updatedFavourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('addBoardToFavourite', async (data, callback) => {
            const { boardId, type } = data;
            try {
                const updatedFavourite = await workspaceController.addBoardToFavourite(boardId, type);
                emitResponse('addBoardToFavourite', updatedFavourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('removeBoardFromFavourite', async (data, callback) => {
            const { boardId, type } = data;
            try {
                const updatedFavourite = await workspaceController.removeBoardFromFavourite(boardId, type);
                emitResponse('removeBoardFromFavourite', updatedFavourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('getFavourite', async (data, callback) => {
            const { userId, type } = data;
            try {
                const favourite = await workspaceController.getFavourite(userId, type);
                emitResponse('getFavourite', favourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('isBoardInFavourite', async (data, callback) => {
            const { boardId, type } = data;
            try {
                const updatedFavourite = await workspaceController.isBoardInFavourite(boardId, type);
                emitResponse('isBoardInFavourite', updatedFavourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('isWorkspaceInFavourite', async (data, callback) => {
            const { workspaceId, type } = data;
            try {
                const updatedFavourite = await workspaceController.isWorkspaceInFavourite(workspaceId, type);
                emitResponse('isWorkspaceInFavourite', updatedFavourite, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('getNotifications', async (data, callback) => {
            try {
                const notifications = await workspaceController.getNotifications(adminId);
                emitResponse('getNotifications', notifications, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('updateNotifications', async (data, callback) => {
            const { notifications } = data;
            try {
                const updatedUser = await workspaceController.updateNotifications(adminId, notifications);
                emitResponse('updateNotifications', updatedUser, callback);
            } catch (err) {
                callback({ error: err.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
            delete userSockets[socket.userId]; 
        });
    });

    return router;
};
