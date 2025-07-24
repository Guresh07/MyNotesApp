// models/Note.js
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: [String],
    user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Make sure this matches your User model name
    required: true
  },
  isPublic: { type: Boolean, default: false },
}, {
  timestamps: true // Adds createdAt and updatedAt
});

const Note = mongoose.model('Note', noteSchema);
export default Note;
