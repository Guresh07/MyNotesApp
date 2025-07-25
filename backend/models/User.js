import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // no duplicate usernames
  },
  email: {
    type: String,
    required: true,
    unique: true, // no duplicate emails
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  }

}, {
  timestamps: true // adds createdAt, updatedAt automatically
});

const User = mongoose.model('User', userSchema);
export default User;
