const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// Ensure all queries include tenantId for isolation
noteSchema.index({ tenantId: 1 });
noteSchema.index({ tenantId: 1, userId: 1 });

module.exports = mongoose.model('Note', noteSchema);
