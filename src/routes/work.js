const express = require('express');
const router = express.Router();
const workController = require('../controllers/workcontroller');

// Workspace Routes
router.get('/', workController.getWorkspaces);
router.get('/:id', workController.getWorkspaceById);
router.post('/', workController.createWorkspace);
router.put('/:id', workController.updateWorkspace);
router.delete('/:id', workController.deleteWorkspace);
router.post('/:id/add-member', workController.addMemberToWorkspace);

// Board Routes
router.post('/:workspaceId/boards', workController.addBoardToWorkspace);
router.delete('/:workspaceId/boards/:boardId', workController.removeBoardFromWorkspace);
router.put('/boards', workController.updateBoardInWorkspace);

// Group Routes
router.post('/boards/:boardId/groups', workController.addGroupToBoard);
router.delete('/boards/:boardId/groups/:groupId', workController.removeGroupFromBoard);
router.put('/groups', workController.updateGroupInBoard);

// Item Routes
router.post('/groups/:groupId/items', workController.addItemToGroup);
router.delete('/groups/:groupId/items/:itemId', workController.removeItemFromGroup);
router.put('/items', workController.updateItemInGroup);

module.exports = router;
