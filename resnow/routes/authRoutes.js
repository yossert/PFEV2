const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { changePassword } = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
