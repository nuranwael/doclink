const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();
const User = require('./models/user');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB connection error:", err));



//  Routes
const userRoutes = require('./routes/users');
const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/bookings');
const prescriptionRoutes = require('./routes/prescriptions');
const reviewsRouter = require('./routes/reviews');
const adminRoutes = require('./routes/admin');

app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRoutes);


//  Email Validator
const emailValidatorRoute = require('./routes/emailValidator'); 


app.use('/api', emailValidatorRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Frontend static path
const staticPath = path.join(__dirname, 'public');
console.log("✅ Using hardcoded static path:", staticPath);
app.use(express.static(staticPath));


//  fetch dacatra
app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await User.find({ role: 'doctor' }); // Only doctors
      res.json(doctors);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  });
  


//  Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
  
//  404 Fallback 
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
