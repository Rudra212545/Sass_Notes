const express = require('express');
const Tenant = require('../models/Tenant');
const { auth, requireRole } = require('../middleware/auth');
const router = express.Router();

const connectDB = require('../config/database');

// Ensure DB connection for serverless
router.use(async (req, res, next) => {
  await connectDB();
  next();
});


// Upgrade tenant to Pro (Admin only)
router.post('/:slug/upgrade', auth, requireRole(['ADMIN']), async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      { slug: req.params.slug, _id: req.tenantId }, // Ensure user can only upgrade their own tenant
      { 
        plan: 'PRO',
        noteLimit: -1 // -1 means unlimited
      },
      { new: true }
    );
    
    if (!tenant) {
      return res.status(404).json({ error: 'Tenant not found' });
    }
    
    res.json({ 
      message: 'Successfully upgraded to Pro plan',
      tenant 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
