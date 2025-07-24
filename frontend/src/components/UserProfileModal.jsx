import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const UserProfileModal = ({ show, handleClose }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    handleClose(); // Close modal
    window.location.replace("/login")
    navigate("/login"); // Redirect to login
  };

  return (
    <Modal show={show} onHide={handleClose} size="sm" centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <i className="bi bi-person-circle me-2"></i> User Profile
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {user ? (
          <div className="px-2">
            <p><strong>👤 Username:</strong> {user.username}</p>
            <p><strong>📧 Email:</strong> {user.email}</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-danger fw-semibold">🔒 You need to login first to access your notes.</p>
            <Link to="/login" className="btn btn-outline-primary mt-2">
              <i className="bi bi-box-arrow-in-right"></i> Login Now
            </Link>
          </div>
        )}
      </Modal.Body>

      {user && (
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
          <Button variant="danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </Button>
        </Modal.Footer>
      )}
    </Modal>

  );
};

export default UserProfileModal;
