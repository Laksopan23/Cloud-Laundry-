const Employee = require('../models/empUser');

// Signup Controller
exports.signupEmployee = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    const existingUser = await Employee.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already taken' });

    const employee = new Employee({ name, email, username, password });
    await employee.save();

    res.status(201).json({ message: 'Signup successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login Controller
exports.loginEmployee = async (req, res) => {
  try {
    const { username, password } = req.body;

    const employee = await Employee.findOne({ username });
    if (!employee) return res.status(404).json({ message: 'User not found' });

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
