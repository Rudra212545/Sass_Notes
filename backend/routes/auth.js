const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const User = require('../models/User');
const Tenant = require('../models/Tenant');
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
    console.log('🔐 Login attempt for:', req.body.email);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).populate('tenantId');
    
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔐 Found user:', {
      email: user.email,
      role: user.role
    });

    // BYPASS bcrypt - just check if password is "password"
    const isValidPassword = password === 'password';
    console.log('🔐 Password check (BYPASS - no bcrypt):', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Wrong password (must be "password")');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        tenantId: user.tenantId._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenant: {
        _id: user.tenantId._id,
        name: user.tenantId.name,
        slug: user.tenantId.slug,
        plan: user.tenantId.plan,
        noteLimit: user.tenantId.noteLimit
      }
    };

    console.log('✅ Login successful (BYPASS MODE) for:', user.email);
    res.json({ token, user: userResponse });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});


// Register Route 
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    
    const { email, password, tenantName, role = 'MEMBER' } = req.body;

    // Validation
    if (!email || !password || !tenantName) {
      return res.status(400).json({ 
        error: 'Email, password, and tenant name are required' 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User with this email already exists' 
      });
    }

    // Create tenant slug
    const tenantSlug = tenantName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Find or create tenant
    let tenant = await Tenant.findOne({ slug: tenantSlug });
    if (!tenant) {
      tenant = new Tenant({
        name: tenantName,
        slug: tenantSlug,
        plan: 'FREE',
        noteLimit: 3
      });
      await tenant.save();
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      tenantId: tenant._id
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
        tenantId: tenant._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return response
    const userResponse = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenant: {
        _id: tenant._id,
        name: tenant.name,
        slug: tenant.slug,
        plan: tenant.plan,
        noteLimit: tenant.noteLimit
      }
    };

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed: ' + error.message 
    });
  }
});



module.exports = router;
