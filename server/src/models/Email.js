import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
  sentAt: { type: Date },
  error: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  collection: 'emails'  // Force le nom exact de la collection
});

const Email = mongoose.model('Email', emailSchema);

export default Email;
