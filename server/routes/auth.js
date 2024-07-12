const express = require('express');
const AuthController = require('../controllers/authController')

const router = express.Router();

router.post('/signup', AuthController.createUser);
router.post('/account-verification', AuthController.accountVerification);
router.post('/login', AuthController.login);
router.post('/resend-email', AuthController.reSendEmail);

module.exports = router;