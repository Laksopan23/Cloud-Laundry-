const bcrypt = require('bcryptjs');
const Employee = require('../models/empUser');
const User = require('../models/UserModel');

const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};


// Signup Controller
exports.signupEmployee = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // Check if username is already taken
    const existingUser = await Employee.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    // Create new employee
    const employee = new Employee({ name, email, username, password });
    await employee.save();

    // Generate token using the employee object
    const token = generateToken(employee);

    // Send response
    res.status(201).json({ 
      message: 'Signup successful', 
      token, 
      role: employee.role || 'employee' // Default to 'employee' if role is undefined
    });
  } catch (err) {
    console.error('Signup error:', err); // Log error for debugging
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
      token,
      role: user.role || 'employee' // default role for Employee schema
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


// Check Username Availability
exports.checkUsernameAvailability = async (req, res) => {
  try {
    const { username } = req.query; // Get username from query parameter
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