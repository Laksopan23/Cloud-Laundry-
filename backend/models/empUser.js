const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Function to generate unique Employee ID
const generateEmployeeId = async () => {
  let isUnique = false;
  let employeeId;

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit number
    employeeId = `EM${randomNum}`;
    const existingEmployee = await mongoose.model('Employee').findOne({ employeeId });
    if (!existingEmployee) isUnique = true;
  }

  return employeeId;
};

const employeeSchema = new mongoose.Schema({
  // Basic Information
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Full Name
  email: { type: String, required: true, unique: true }, // Also used for login
  phone: { type: String }, // Phone Number
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },

  // Identity & Verification
  nationalId: { type: String }, // Aadhar/SSN/National ID
  //profilePhoto: { type: String }, // URL to photo

  // Employment Details
  //jobTitle: { type: String }, // e.g., Pickup Agent, Manager
  employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract'] },
  startDate: { type: Date },

  // Contact & Address
  currentAddress: { type: String },
  emergencyContactName: { type: String },
  emergencyContactNumber: { type: String },
  emergencyContactRelation: { type: String },

  // Login Credentials
  username: { type: String, unique: true, sparse: true }, // Optional if email is used
  password: { type: String, required: true },

  // Banking & Payment
  bankName: { type: String },
  accountNumber: { type: String },

  // Role
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' }
});

// Pre-save hook to hash password
employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
employeeSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the model and generator
module.exports = {
  Employee: mongoose.model('Employee', employeeSchema),
  generateEmployeeId
};
