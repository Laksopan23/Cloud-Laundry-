const bcrypt = require('bcryptjs');
const { Employee, generateEmployeeId } = require('../models/empUser');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role, employeeId: user.employeeId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Signup Controller
exports.signupEmployee = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if username or email is already taken
    const existingUser = await Employee.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username ? 'Username already taken' : 'Email already in use' 
      });
    }

    // Generate unique employeeId
    const employeeId = await generateEmployeeId();

    // Create new employee
    const employee = new Employee({ name, email, username, password, employeeId });
    await employee.save();

    // Generate token using the employee object
    const token = generateToken(employee);

    // Send response
    res.status(201).json({ 
      message: 'Signup successful', 
      token, 
      employeeId: employee.employeeId,
      role: employee.role
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// Login Controller
exports.loginEmployee = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user;

    // Check if it's the admin login
    if (username === 'admin') {
      user = await User.findOne({ username });
    } else {
      user = await Employee.findOne({ username });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login successful',
      username: user.username,
      employeeId: user.employeeId || null, // Admin may not have employeeId
      token,
      role: user.role || 'employee'
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Check Username Availability
exports.checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const existingUser = await Employee.findOne({ username });
    if (existingUser) {
      return res.status(200).json({ available: false, message: 'Username already taken' });
    }

    return res.status(200).json({ available: true, message: 'Username is available' });
  } catch (err) {
    console.error('Username check error:', err);
    res.status(500).json({ message: 'Server error during username check' });
  }
};

// Get All Employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select('-password'); // Exclude password
    res.status(200).json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ message: 'Server error while fetching employees' });
  }
};


// Get Employee by Username
exports.getEmployeeByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const employee = await Employee.findOne({ username }).select('-password');
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ message: 'Server error while fetching employee' });
  }
};

// Update Employee Profile (excluding restricted fields)
exports.updateEmployeeProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const updateData = { ...req.body };

    // Fields not allowed to update
    const restrictedFields = ['username', 'email', 'name', 'employeeId', 'role'];
    restrictedFields.forEach(field => delete updateData[field]);

    const updatedEmployee = await Employee.findOneAndUpdate(
      { username },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', employee: updatedEmployee });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
};
