const express = require('express');
const router = express.Router();
const workController = require('../controllers/workcontroller');
const {checkAuth} = require('../middlewares/auth');

router.get('/', workController.getWorkspaces);
router.get('/:id', workController.getWorkspaceById);
router.post('/', workController.createWorkspace);
router.put('/:id', workController.updateWorkspace);
router.delete('/:id', workController.deleteWorkspace);
router.post('/:id/members', workController.addMemberToWorkspace);

router.post('/:id/boards', workController.addBoardToWorkspace);
router.delete('/:workspaceId/:boardId', workController.removeBoardFromWorkspace);
router.put('/:workspaceId/:boardId', workController.updateBoardInWorkspace);

router.post('/:workspaceId/:boardId/', workController.addGroupToBoard);
router.delete('/:workspaceId/:boardId/:groupId', workController.removeGroupFromBoard);
router.put('/:workspaceId/:boardId/:groupId', workController.updateGroupInBoard);

router.post('/:workspaceId/:boardId/:groupId/', workController.addItemToGroup);
router.delete('/:workspaceId/:boardId/:groupId/:itemId', workController.removeItemFromGroup);
router.put('/:workspaceId/:boardId/:groupId/:itemId', workController.updateItemInGroup);

module.exports = router;
