const Email = require('../models/Email');

// In-memory store for OTPs
const otpStore = new Map();

// Generate OTP
function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const newEmail = new Email({ email });
    await newEmail.save();

    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    console.log(`📧 Email stored: ${email}, OTP: ${otp}`);
    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: "Something went wrong." });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
  }

  if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  if (storedData.otp === otp) {
    otpStore.delete(email);
    res.status(200).json({ message: "OTP verified successfully!" });
  } else {
    storedData.attempts += 1;
    if (storedData.attempts >= 3) {
      otpStore.delete(email);
      res.status(400).json({ message: "Too many failed attempts. Please request a new OTP." });
    } else {
      res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
  }
};

exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    console.log(`📧 Resent OTP: ${otp} to ${email}`);
    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    console.error('❌ Error resending OTP:', error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
};
