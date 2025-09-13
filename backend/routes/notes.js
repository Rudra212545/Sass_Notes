const express = require('express');
const Note = require('../models/Note');
const Tenant = require('../models/Tenant');
const { auth } = require('../middleware/auth');
const router = express.Router();

const connectDB = require('../config/database');

// Ensure DB connection for serverless
router.use(async (req, res, next) => {
  await connectDB();
  next();
});




// Apply auth middleware to all routes
router.use(auth);

// Create note with subscription limit check
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Get tenant information
    const tenant = await Tenant.findById(req.tenantId);
    
    // Check note limit for FREE plan
    if (tenant.plan === 'FREE') {
      const noteCount = await Note.countDocuments({ tenantId: req.tenantId });
      if (noteCount >= tenant.noteLimit) {
        return res.status(400).json({ 
          error: 'Note limit reached. Upgrade to Pro for unlimited notes.',
          code: 'NOTE_LIMIT_REACHED'
        });
      }
    }

    const note = new Note({
      title,
      content,
      tenantId: req.tenantId, // Ensures tenant isolation
      userId: req.user._id
    });

    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all notes for current tenant only
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.tenantId })
      .populate('userId', 'email')
      .sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific note (with tenant isolation)
router.get('/:id', async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.tenantId // Critical for security
    }).populate('userId', 'email');
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update note (with tenant isolation)
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, tenantId: req.tenantId },
      { title, content },
      { new: true }
    );
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete note (with tenant isolation)
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      tenantId: req.tenantId 
    });
    
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
