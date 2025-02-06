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
    router.use(authMiddleware);
    router.get('/tokenexpired',userController.verifyToken);
    router.get('/allusers',userController.getAllUsers);
    router.get('/getuserdetails',userController.getUserDetails);
    router.get('/checkRole',userController.checkRole);
    router.patch('/promoteToAdmin',userController.promote);
    router.patch('/dePromoteToMember',userController.dePromote);
    router.put('/updateUser',userController.updateUser);
    router.post('/addMember',(req, res) => userController.addMemberToWorkspace(req, res, io));
    router.post('/sendinvite',userController.isUserWithEmailExists);
    router.post('/sendMessage',userController.sendMessage);
    router.delete('/removeMember',userController.removeMemberToWorkspace);
    return router;
}
