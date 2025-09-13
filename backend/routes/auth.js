const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const connectDB = require('../config/database');

// Ensure DB connection for serverless
router.use(async (req, res, next) => {
  await connectDB();
  next();
});


// Login endpoint (required for testing)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with tenant information
    const user = await User.findOne({ email }).populate('tenantId');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, tenantId: user.tenantId._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: user.tenantId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
