import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api/auth";
import { BsCheckCircle, BsXCircle, BsPersonX, BsPersonCheck } from "react-icons/bs"; // or use bootstrap-icons CDN in index.html


const AdminDashboard = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        try {
            await axios.patch(
                `${API_BASE}/admin/approve/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAllUsers(prev =>
                prev.map(user =>
                    user._id === userId ? { ...user, isApproved: true } : user
                )
            );
        } catch (err) {
            console.error("Approve failed", err);
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.delete(`${API_BASE}/admin/reject/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllUsers(prev => prev.filter(user => user._id !== userId));
        } catch (err) {
            console.error("Reject failed", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = allUsers
        .filter(user => {
            if (filter === "approved") return user.isApproved;
            if (filter === "notApproved") return !user.isApproved;
            return true;
        })
        .filter(user =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        );

    if (loading) return <div className="text-center mt-5">Loading users...</div>;

    return (
        <div className="col-sm-10 col-12 mt-4">
            <h2 className="mb-4">🛠️ Admin Dashboard</h2>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
                <div className="btn-group mb-2">
                    <button
                        className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={`btn btn-sm ${filter === "approved" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("approved")}
                    >
                        Approved
                    </button>
                    <button
                        className={`btn btn-sm ${filter === "notApproved" ? "btn-primary" : "btn-outline-primary"}`}
                        onClick={() => setFilter("notApproved")}
                    >
                        Not Approved
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="🔍 Search by username"
                    className="form-control form-control-sm w-auto border-secondary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="alert alert-secondary border-secondary">
                    No users found for this filter or search.
                </div>
            ) : (
                <div className="row g-3">
                    {filteredUsers.map((user) => (
                        <div className="col-md-6 col-lg-4" key={user._id}>
                            <div className={`card shadow-sm border-${user.isApproved ? "success" : "warning"}`}>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h5 className="card-title mb-0">
                                            <i className="bi bi-person-circle me-2"></i>
                                            {user.username}
                                        </h5>
                                        <span className={`badge ${user.isApproved ? "bg-success" : "bg-warning text-dark"}`}>
                                            {user.isApproved ? (
                                                <>
                                                    <BsCheckCircle className="me-1" /> Approved
                                                </>
                                            ) : (
                                                <>
                                                    <BsXCircle className="me-1" /> Not Approved
                                                </>
                                            )}
                                        </span>
                                    </div>

                                    <div className="d-flex justify-content-between">
                                        <button
                                            onClick={() => handleReject(user._id)}
                                            className="btn btn-outline-danger btn-sm"
                                        >
                                            <BsPersonX className="me-1" /> Reject
                                        </button>
                                        {!user.isApproved && (
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="btn btn-outline-success btn-sm me-2"
                                            >
                                                <BsPersonCheck className="me-1" /> Approve
                                            </button>
                                        )}
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

export default AdminDashboard;
