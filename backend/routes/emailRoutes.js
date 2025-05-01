const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  verifyOTP,
  resendOTP
} = require('../controllers/emailController');

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);

module.exports = router;
