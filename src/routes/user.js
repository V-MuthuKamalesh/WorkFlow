const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { validationMiddleware } = require('../middlewares/validationMiddleware.js');
const { validateUser } = require('../utils/joi.js');
router.post('/checkRole',userController.checkRole);
router.post('/signup', validationMiddleware(validateUser), userController.signup);
router.post('/email',userController.email);
router.post('/oauth', userController.OAuth);
router.post('/login', userController.login);
router.post('/tokenexpired',userController.verifyToken);
router.post('/resetemail',userController.sendPasswordResetEmail);
router.post('/sendinvite',userController.isUserWithEmailExists);
router.post('/addMember',userController.addMemberToWorkspace);
router.post('/removeMember',userController.removeMemberToWorkspace);
router.post('/promoteToAdmin',userController.promote);
router.post('/sendMessage',userController.sendMessage);
router.post('/resetpassword',userController.resetPassword);
router.get('/allusers',userController.getAllUsers);
router.get('/getuserdetails',userController.getUserDetails);
router.put('/updateUser',userController.updateUser);
module.exports = router;
