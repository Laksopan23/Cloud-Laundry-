const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

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


// Routes
app.use('/api/email', emailRoutes);
app.use('/api/orders', orderRoutes);

//mock
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
