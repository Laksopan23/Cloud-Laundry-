const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Function to generate unique Employee ID
const generateEmployeeId = async () => {
  let isUnique = false;
  let employeeId;

  while (!isUnique) {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit number
    employeeId = `EM${randomNum}`;
    
    // Check if ID already exists
    const existingEmployee = await mongoose.model('Employee').findOne({ employeeId });
    if (!existingEmployee) {
      isUnique = true;
    }
  }

  return employeeId;
};

const employeeSchema = new mongoose.Schema({
  employeeId: { 
    type: String, 
    required: true, 
    unique: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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

// Export the model and generateEmployeeId function
module.exports = {
  Employee: mongoose.model('Employee', employeeSchema),
  generateEmployeeId
};