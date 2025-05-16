const express = require('express');
const router = express.Router();
const { signupEmployee, loginEmployee, checkUsernameAvailability, getAllEmployees } = require('../controllers/employeeController');

router.post('/signup', signupEmployee);
router.post('/login', loginEmployee);
router.get('/check-username', checkUsernameAvailability); // New route
router.get('/', getAllEmployees); // New route for fetching all employees

module.exports = router;

