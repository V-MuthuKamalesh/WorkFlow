const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
const { validationMiddleware } = require('../middlewares/validationMiddleware.js');
const { validateUser } = require('../utils/joi.js');
const { authMiddleware } = require('../middlewares/auth.js');
module.exports = (io) => {
    router.post('/oauth', userController.OAuth);
    router.post('/login', userController.login);
    router.post('/signup', validationMiddleware(validateUser), userController.signup);
    router.post('/resetemail',userController.sendPasswordResetEmail);
    router.post('/resetpassword',userController.resetPassword);
    router.post('/email',userController.email);
    router.post('/tokenexpired',userController.verifyToken);
    router.use(authMiddleware);
    router.post('/addMember',(req, res) => userController.addMemberToWorkspace(req, res, io));
    router.post('/removeMember',userController.removeMemberToWorkspace);
    router.post('/promoteToAdmin',userController.promote);
    router.post('/dePromoteToMember',userController.dePromote);
    router.get('/getuserdetails',userController.getUserDetails);
    router.post('/checkRole',userController.checkRole);
    router.post('/sendinvite',userController.isUserWithEmailExists);
    router.post('/sendMessage',userController.sendMessage);
    router.get('/allusers',userController.getAllUsers);
    router.put('/updateUser',userController.updateUser);
    return router;
}
