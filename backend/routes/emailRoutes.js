const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  verifyOTP,
  resendOTP,
  resetPassword
} = require('../controllers/emailController');

router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
