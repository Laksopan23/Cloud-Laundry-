const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['admin', 'employee'], 
    default: 'employee' 
  },
  adminPrivileges: { 
    type: Object, 
    default: null,
    required: function() { return this.role === 'admin'; }
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password for login
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Ensure only one admin exists (optional, can be adjusted)
userSchema.pre('save', async function (next) {
  if (this.role === 'admin') {
    const adminCount = await mongoose.model('User').countDocuments({ role: 'admin' });
    if (adminCount >= 1 && !this.isModified('role')) {
      return next(new Error('Only one admin is allowed'));
    }
  }
  next();
});

module.exports = mongoose.model('User', userSchema);