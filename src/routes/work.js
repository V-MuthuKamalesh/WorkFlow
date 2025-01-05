const express = require('express');
const router = express.Router();
const workController = require('../controllers/workcontroller');
const {checkAuth} = require('../middlewares/auth');

router.get('/getWorkspace', workController.getWorkspaces);
router.get('/getBoardsbyWorkspacebyId/:id', workController.getWorkspaceById);
router.post('/createWorkspace', workController.createWorkspace);
router.put('/updateWorkspacebyId/:id', workController.updateWorkspace);
router.delete('/deleteWorkspacebyId/:id', workController.deleteWorkspace);
router.post('/addMember/:id/members', workController.addMemberToWorkspace);

router.post('/addBoard/:id/boards', workController.addBoardToWorkspace);
router.delete('/deleteBoard/:workspaceId/:boardId', workController.removeBoardFromWorkspace);
router.put('/updateBoard/:workspaceId/:boardId', workController.updateBoardInWorkspace);
router.get('/getBoard/:boardId',workController.getBoardById)

router.post('/addGroup/:workspaceId/:boardId/', workController.addGroupToBoard);
router.delete('/deleteGroup/:workspaceId/:boardId/:groupId', workController.removeGroupFromBoard);
router.put('/updateGroup/:workspaceId/:boardId/:groupId', workController.updateGroupInBoard);

router.post('/addItem/:workspaceId/:boardId/:groupId/', workController.addItemToGroup);
router.delete('/deleteItem/:workspaceId/:boardId/:groupId/:itemId', workController.removeItemFromGroup);
router.put('/updateItem/:workspaceId/:boardId/:groupId/:itemId', workController.updateItemInGroup);
router.post('/addMembers/:workspaceId/:boardId/:groupId/:itemId',workController.addMembersToItem);


module.exports = router;
