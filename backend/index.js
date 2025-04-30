const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Email = require('./models/Email');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Store OTPs temporarily (in production, use a database)
const otpStore = new Map();

// Generate OTP
function generateOTP() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// CONNECT TO MONGODB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cloud_laundry', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB - Database: cloud_laundry');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Route for Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Save email to MongoDB
    const newEmail = new Email({ email });
    await newEmail.save();

    // Generate and store OTP
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });

    console.log(`📧 Email stored: ${email}, OTP: ${otp}`); // For testing, remove in production
    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: "Something went wrong." });
  }
});

// Route for OTP Verification
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);
  
  if (!storedData) {
    return res.status(400).json({ message: "OTP expired or not found. Please request a new one." });
  }
  
  // Check if OTP is expired (10 minutes)
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
});

// Route for Resending OTP
app.post('/resend-otp', async (req, res) => {
  const { email } = req.body;
  
  try {
    const otp = generateOTP();
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    });
    
    console.log(`📧 Resent OTP: ${otp} to ${email}`); // For testing, remove in production
    res.status(200).json({ message: "New OTP sent successfully!" });
  } catch (error) {
    console.error('❌ Error resending OTP:', error);
    res.status(500).json({ message: "Failed to resend OTP." });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
