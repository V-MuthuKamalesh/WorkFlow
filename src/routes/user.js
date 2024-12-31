const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');
router.post('/signup', userController.signup);
router.post('/email', userController.checkAndSignup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
module.exports = router;
