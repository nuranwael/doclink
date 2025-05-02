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

// ✅ Routes
const userRoutes = require('./routes/users');
const availabilityRoutes = require('./routes/availability');
const bookingRoutes = require('./routes/bookings');
const prescriptionRoutes = require('./routes/prescriptions');
const reviewsRouter = require('./routes/reviews');

app.use('/api/users', userRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewsRouter);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);



// Frontend static path
const staticPath = path.join(__dirname, 'public');
console.log("✅ Using hardcoded static path:", staticPath);

// Serve frontend
app.use(express.static(staticPath));



// Check if folder is accessible
fs.access(staticPath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error("❌ Folder does not exist:", staticPath);
    } else {
        console.log("✅ Folder is accessible.");
    }
});


// Optional: Debug route to list frontend files
app.get('/debug-files', (req, res) => {
    fs.readdir(staticPath, (err, files) => {
        if (err) {
            console.error("❌ Failed to read files in:", staticPath);
            return res.status(500).send("Can't read frontend folder");
        }
        console.log("📂 Files in proj/:", files);
        res.json({ files });
    });
});

// Endpoint to fetch all doctors
app.get('/api/doctors', async (req, res) => {
    try {
      const doctors = await User.find({ role: 'doctor' }); // Only doctors
      res.json(doctors);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  });
  


// ✅ Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});


// In your server.js (or in routes/doctors.js)

// Assuming User model represents both doctors and patients


// Endpoint to update doctor information (only specialty, address, and phone number)
app.put('/api/doctors/:id', async (req, res) => {
  try {
    const { specialty, address, phone } = req.body;

    // Validate input data
    if (!specialty || !address || !phone) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Update doctor information
    const updatedDoctor = await User.findByIdAndUpdate(
      req.params.id, 
      { specialty, address, phone }, 
      { new: true }  // Return updated document
    );

    // If no doctor is found
    if (!updatedDoctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Send back the updated doctor object
    res.json(updatedDoctor);
  } catch (err) {
    console.error('❌ Error updating doctor:', err);
    res.status(500).json({ error: 'Failed to update doctor profile.' });
  }
});

app.get('/test', (req, res) => {
    res.send("✅ Test route working");
  });
  
// ❌ 404 Fallback (put at the bottom)
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
