const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
    const { fullname, username, email, phone, password, role, specialty, address } = req.body;

    console.log("Received signup data:", req.body);

    if (!fullname || !username || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required, including role.' });
    }

    if (role === 'doctor' && (!specialty || !address)) {
        return res.status(400).json({ error: 'Specialty and address are required for doctors.' });
    }

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        

        const newUser = new User({
            fullname,
            username,
            email,
            phone,
            password: hashedPassword,
            role,
            specialty: role === 'doctor' ? specialty : undefined,
            address: role === 'doctor' ? address : undefined
        });

        await newUser.save();
        console.log("✅ New user saved. Role:", newUser.role);

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                email: newUser.email,
                phone: newUser.phone,
                role: newUser.role,
                specialty: newUser.specialty,
                address: newUser.address
            }
        });

    } catch (err) {
        console.error("❌ Signup error:", err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});


// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role,
                specialty: user.specialty,
                address: user.address
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
});

// SEARCH DOCTORS
router.get('/doctors', async (req, res) => {
    try {
        const { specialty, username } = req.query;

        const query = { role: 'doctor' };

        if (specialty && specialty !== "Choose a specialty") {
            query.specialty = new RegExp(specialty, 'i');
        }

        if (username) {
            query.fullname = new RegExp(username, 'i'); 
        }

        const doctors = await User.find(query).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error('❌ Error in doctor search:', err);
        res.status(500).json({ error: 'Server error during doctor search' });
    }
});

module.exports = router;       