// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const User = require('./user.model');

// Create Express router
const router = express.Router();

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password,
      email,
    });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', user: newUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Export router
module.exports = router;
