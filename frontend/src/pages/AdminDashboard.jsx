import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../api/auth";

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
            <h2 className="mb-4">Admin Dashboard</h2>

            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
                <div className="btn-group mb-2">
                    <button
                        className={`btn btn-outline-primary btn-sm ${filter === "all" ? "active" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </button>
                    <button
                        className={`btn btn-outline-primary btn-sm ${filter === "approved" ? "active" : ""}`}
                        onClick={() => setFilter("approved")}
                    >
                        Approved
                    </button>
                    <button
                        className={`btn btn-outline-primary btn-sm ${filter === "notApproved" ? "active" : ""}`}
                        onClick={() => setFilter("notApproved")}
                    >
                        Not Approved
                    </button>
                </div>

                <input
                    type="text"
                    placeholder="Search by username"
                    className="form-control form-control-sm w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredUsers.length === 0 ? (
                <div className="alert alert-info">No users found for this filter or search.</div>
            ) : (
                <table className="table table-bordered shadow-sm">
                    <thead className="table-light">
                        <tr>
                            <th>Username</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>
                                    <span className={`badge ${user.isApproved ? "bg-success" : "bg-warning text-dark"}`}>
                                        {user.isApproved ? "Approved" : "Not Approved"}
                                    </span>
                                </td>
                                <td>
                                    {!user.isApproved && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(user._id)}
                                                className="btn btn-success btn-sm me-2"
                                            >
                                                Approve
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => handleReject(user._id)}
                                        className="btn btn-danger btn-sm my-1"
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminDashboard;
