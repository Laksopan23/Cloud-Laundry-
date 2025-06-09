const mongoose = require('mongoose');

// Step 1: Define schema structure
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true, // Ensure uniqueness at the schema level
  },
  otp: {
    type: String,
    required: true, // OTP must always be present for these documents
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // OTP valid for 60 seconds
  },
  used: {
    type: Boolean,
    default: false,
  },
});

// Step 2: Export model to use in other files
module.exports = mongoose.model('Email', emailSchema, 'emails');
