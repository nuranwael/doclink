const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);
  const hashedPassword = await bcrypt.hash('password', 10);

  const admin = new User({
    fullname: "Admin User",
    username: "admin",
    email: "admin@example.com",
    phone: "123456789",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();
  console.log("✅ Admin created successfully");
  process.exit();
}

createAdmin();
