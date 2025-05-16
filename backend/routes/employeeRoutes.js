const express = require('express');
const router = express.Router();
const { signupEmployee, loginEmployee, checkUsernameAvailability } = require('../controllers/employeeController');

router.post('/signup', signupEmployee);
router.post('/login', loginEmployee);
router.get('/check-username', checkUsernameAvailability); // New route

module.exports = router;
