// backend/routes/feedback.js
import express from "express";
import Feedback from "../models/Feedback.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/feedback
router.post("/", verifyToken, async (req, res) => {
    try {
        const feedback = new Feedback({
            user: req.user.userId,
            message: req.body.message,
        });
        // if (message.length > 300) {
        //     return res.status(400).json({ message: "Feedback too long. Max 300 characters." });
        // }
        await feedback.save();
        res.status(201).json({ message: "Feedback submitted" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
