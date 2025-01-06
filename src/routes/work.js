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
router.delete('/deleteBoard/:boardId', workController.removeBoardFromWorkspace);
router.put('/updateBoard/:boardId', workController.updateBoardInWorkspace);
router.get('/getBoard/:boardId',workController.getBoardById)

router.post('/addGroup/:boardId/', workController.addGroupToBoard);
router.delete('/deleteGroup/:groupId', workController.removeGroupFromBoard);
router.put('/updateGroup/:groupId', workController.updateGroupInBoard);

router.post('/addItem/:groupId/', workController.addItemToGroup);
router.delete('/deleteItem/:itemId', workController.removeItemFromGroup);
router.put('/updateItem/:itemId', workController.updateItemInGroup);
router.post('/addMembers/:itemId',workController.addMembersToItem);


module.exports = router;
