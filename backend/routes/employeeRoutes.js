const express = require('express');
const router = express.Router();
const { 
    signupEmployee, 
    loginEmployee, 
    checkUsernameAvailability, 
    getAllEmployees, 
    getEmployeeByUsername,
    updateEmployeeProfile,
 } = require('../controllers/employeeController');

router.post('/signup', signupEmployee);
router.post('/login', loginEmployee);
router.get('/check-username', checkUsernameAvailability); // New route
router.get('/', getAllEmployees); // New route for fetching all employees
router.get('/profile/:username', getEmployeeByUsername);
router.put('/update/:username', updateEmployeeProfile);

module.exports = router;

