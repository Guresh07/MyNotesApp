import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminOnly.js';

const router = express.Router();

// ✅ Get list of unapproved users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    const users = await User.find({ isAdmin: false });
    res.json(users);
});

// ✅ Approve or Reject user
router.patch('/approve/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isApproved = true;
    await user.save();

    res.json({ message: 'User approved', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


router.delete('/reject/:id', verifyToken, isAdmin, async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User rejected and deleted' });
});

export default router;
