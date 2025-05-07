const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  phone:    { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    required: true,
    lowercase: true,
  },
    
  
  specialty: { type: String },
  address: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
