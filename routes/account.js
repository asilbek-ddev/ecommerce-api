const express = require('express');
const router = express.Router();
const { sendCode, verifyCode, getProfile } = require('../controllers/accountController');

router.post('/send-code', sendCode);
router.post('/verify-code', verifyCode);
router.get('/profile', getProfile);

module.exports = router;
