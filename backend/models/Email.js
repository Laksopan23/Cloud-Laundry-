const mongoose = require('mongoose');

// Step 1: Define schema structure
const emailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Step 2: Export model to use in other files
module.exports = mongoose.model('Email', emailSchema, 'emails');
