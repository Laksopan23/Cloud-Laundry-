const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Signup Controller
exports.signupUser = async (req, res) => {
  try {
    const { name, email, username, password, role, adminPrivileges } = req.body;

    // Restrict admin signup to authorized requests (e.g., via admin token or environment flag)
    if (role === 'admin' && !req.headers['x-admin-secret'] === process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: 'Unauthorized to create admin account' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.username === username ? 'Username already taken' : 'Email already in use' 
      });
    }

    const user = new User({ 
      name, 
      email, 
      username, 
      password, 
      role: role || 'employee',
      adminPrivileges: role === 'admin' ? adminPrivileges || {} : null 
    });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ message: 'Signup successful', token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Controller
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select('+password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};