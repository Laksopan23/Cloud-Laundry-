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
  await transporter.sendMail(mailOptions);
}

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await Employee.findOne({ email });
  if (!user) return res.status(404).json({ message: "No employee found with this email." });

  const otp = generateOTP();
  await Email.create({ email, otp }); // will auto-expire in 60s

  await sendOTPEmail(email, otp);
  res.status(200).json({ message: "OTP sent to email!" });
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  const user = await Employee.findOne({ email });
  if (!user) return res.status(404).json({ message: "No employee found with this email." });

  const otp = generateOTP();
  await Email.create({ email, otp }); // new doc, old will expire

  await sendOTPEmail(email, otp);
  res.status(200).json({ message: "New OTP sent!" });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Email.findOne({ email, otp, used: false });
  if (!record) return res.status(400).json({ message: "Invalid or expired OTP." });

  // Mark as used
  record.used = true;
  await record.save();

  res.status(200).json({ message: "OTP verified!" });
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await Employee.findOne({ email });
  if (!user) return res.status(404).json({ message: "Employee not found." });

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  res.status(200).json({ message: "Password reset successful!" });
};
