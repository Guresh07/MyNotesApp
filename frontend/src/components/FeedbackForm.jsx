// src/components/FeedbackForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { API_BASE } from "../api/auth";
import { Link } from "react-router-dom";

const FeedbackForm = () => {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const token = localStorage.getItem("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/feedback`, { message }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSubmitted(true);
            setMessage("");
        } catch (err) {
            console.error("Error submitting feedback", err);
        }
    };

    return (
        <div className="col-12 col-sm-10 mt-4">
            <h4>We value your feedback 💬</h4>
            {submitted ? (
                <>
                    <div>
                        <div className="alert alert-success">Thank you for your feedback!</div>
                        <div>
                            <Link to="/" className="btn btn-outline-secondary me-2">⬅️ Back to Home</Link>
                        </div>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit} id="feedback">
                    <div className="mb-3">
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Write your feedback here... (max 300 characters)"
                            value={message}
                            maxLength={300} // ✅ Limit in frontend too
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <div className="text-end small">
                            {message.length}/300 characters
                        </div>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-primary">Submit Feedback</button>
                        <Link to="/" className="btn btn-outline-secondary me-2">⬅️ Back to Home</Link>
                    </div>
                </form>
            )}
        </div>
    );
};

export default FeedbackForm;
