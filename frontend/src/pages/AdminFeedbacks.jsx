import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api/auth";
// import "bootstrap-icons/font/bootstrap-icons.css";

const AdminFeedbacks = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = localStorage.getItem("token");

    const fetchFeedbacks = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/feedbacks`, {
                params: { page: currentPage, search },
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(res.data.feedbacks);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching feedbacks", err);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [currentPage, search]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this feedback?")) return;
        try {
            await axios.delete(`${API_BASE}/admin/feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setFeedbacks(feedbacks.filter(fb => fb._id !== id));
        } catch (err) {
            console.error("Error deleting feedback", err);
        }
    };

    const handleReviewedToggle = async (id) => {
        try {
            await axios.patch(`${API_BASE}/admin/feedbacks/${id}/toggle`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchFeedbacks();
        } catch (err) {
            console.error("Toggle reviewed failed", err);
        }
    };

    return (
        <div className="col-12 col-sm-10 py-4 rounded-3">
            <h2 className="mb-4">
                <i className="bi bi-chat-dots-fill me-2"></i>Admin Feedbacks
            </h2>

            <div className="mb-4">
                <input
                    type="text"
                    className="form-control"
                    placeholder="🔍 Search by username or message..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        {[...Array(totalPages)].map((_, idx) => (
                            <li
                                key={idx}
                                className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}
                            >
                                <button
                                    className="page-link border-info"
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {feedbacks.length === 0 ? (
                <div className="alert alert-warning text-center">
                    No feedbacks found.
                </div>
            ) : (
                <div className="row g-2 feedback-list-scroll-container rounded-3">
                    {feedbacks.map(fb => (
                        <div className="col-md-6" key={fb._id}>
                            <div className={`card shadow-sm h-100`}>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title mb-2">
                                        <i className="bi bi-person-circle me-2"></i>
                                        {fb.user?.username || "Unknown User"}
                                    </h5>
                                    <p
                                        className="card-text flex-grow-1"
                                        style={{ whiteSpace: "pre-wrap", maxHeight: "100px", overflowY: "auto" }}
                                        title={fb.message}
                                    >
                                        {fb.message.length > 300
                                            ? fb.message.slice(0, 300) + "..."
                                            : fb.message}
                                    </p>
                                    <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-3">
                                        <small className="">
                                            <i className="bi bi-clock me-1"></i>
                                            {new Date(fb.createdAt).toLocaleString()}
                                        </small>
                                        <div>
                                            <button
                                                className={`btn btn-sm me-2 ${fb.isReviewed ? 'btn-success' : 'btn-outline-warning'}`}
                                                onClick={() => handleReviewedToggle(fb._id)}
                                            >
                                                <i className="bi bi-check-circle me-1"></i>
                                                {fb.isReviewed ? "Reviewed" : "Mark Reviewed"}
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(fb._id)}
                                            >
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminFeedbacks;
