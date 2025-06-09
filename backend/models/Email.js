const mongoose = require('mongoose');

// Step 1: Define schema structure
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60
  },
  used: {
    type: Boolean,
    default: false
  }
});

// Step 2: Export model to use in other files
module.exports = mongoose.model('Email', emailSchema, 'emails');
