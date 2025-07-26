import express from 'express';
import User from '../models/User.js';
import verifyToken from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminOnly.js';
import Feedback from '../models/Feedback.js';

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

// GET /api/admin/feedbacks - Get all feedbacks
router.get('/feedbacks', verifyToken, isAdmin, async (req, res) => {
  const { search = '', page = 1, limit = 10 } = req.query;

  try {
    // 1. Find users matching the username (case-insensitive)
    const matchingUsers = await User.find({
      username: { $regex: search, $options: 'i' },
    }).select('_id');

    const matchingUserIds = matchingUsers.map(user => user._id);

    // 2. Search feedbacks by message OR user ID
    const query = {
      $or: [
        { message: { $regex: search, $options: 'i' } },
        { user: { $in: matchingUserIds } },
      ],
    };

    // 3. Paginate + populate
    const feedbacks = await Feedback.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.json({
      feedbacks,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });

  } catch (err) {
    console.error("Error in fetching feedbacks", err);
    res.status(500).json({ message: "Failed to fetch feedbacks" });
  }
});


router.patch('/feedbacks/:id/toggle', verifyToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.isReviewed = !feedback.isReviewed; // ✅ toggle isReviewed
    await feedback.save();

    res.json({ message: "Feedback updated", isReviewed: feedback.isReviewed });
  } catch (err) {
    console.error("Toggle Reviewed Error", err);
    res.status(500).json({ message: "Toggle failed" });
  }
});



// DELETE feedback by ID
router.delete("/feedback/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting feedback" });
  }
});

export default router;
