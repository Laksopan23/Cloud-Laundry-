const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

const emailRoutes = require('./routes/emailRoutes');
const orderRoutes = require('./routes/orderRoutes');

//mock
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');



dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB - Database: cloud_laundry');
}).catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Routes
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes);

//mock
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);

app.get('/test-email', async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to yourself for testing
      subject: 'Test Email',
      text: 'This is a test email from Cloud Laundry backend.'
    });
    res.send('Email sent!');
  } catch (err) {
    res.status(500).send('Failed to send email: ' + err.message);
  }
});





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
