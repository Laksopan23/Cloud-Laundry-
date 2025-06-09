const Employee = require('../models/empUser');
const Email = require('../models/Email');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is: ${otp}. It will expire in 60 seconds.`
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}`);
  } catch (error) {
    console.error(`Error sending email to ${email}:`, error);
    throw new Error("Failed to send OTP email."); // Re-throw to be caught by main function's catch
  }
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "No employee found with this email." });

    const otp = generateOTP();
    console.log(`Generated OTP for ${email}: ${otp}`);
    try {
      await Email.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now(), used: false },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`OTP ${otp} stored/updated for ${email}`);
    } catch (dbError) {
      console.error(`Error saving OTP to database for ${email}:`, dbError);
      return res.status(500).json({ message: "Failed to save OTP to database." });
    }

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "OTP sent to email!" });
  } catch (error) {
    console.error('Error in forgotPassword (general catch): ', error);
    res.status(500).json({ message: "Failed to send OTP. Please try again." });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "No employee found with this email." });

    const otp = generateOTP();
    console.log(`Generated OTP for ${email}: ${otp}`);
    try {
      // Using findOneAndUpdate with upsert to replace existing OTP or create new
      await Email.findOneAndUpdate(
        { email },
        { otp, createdAt: Date.now(), used: false },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log(`New OTP ${otp} stored/updated for ${email}`);
    } catch (dbError) {
      console.error(`Error saving/updating OTP to database for ${email}:`, dbError);
      return res.status(500).json({ message: "Failed to save new OTP to database." });
    }

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: "New OTP sent!" });
  } catch (error) {
    console.error('Error in resendOTP (general catch): ', error);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const record = await Email.findOne({ email, otp, used: false });
    if (!record) return res.status(400).json({ message: "Invalid or expired OTP." });

    // Mark as used
    record.used = true;
    await record.save();

    res.status(200).json({ message: "OTP verified!" });
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    res.status(500).json({ message: "Failed to verify OTP. Please try again." });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const user = await Employee.findOne({ email });
    if (!user) return res.status(404).json({ message: "Employee not found." });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password reset successful!" });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: "Failed to reset password. Please try again." });
  }
};