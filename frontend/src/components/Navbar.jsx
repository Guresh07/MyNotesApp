import React, { useState } from "react";
import UserProfileModal from "./UserProfileModal";
import { Link } from "react-router-dom";
import userIcon from "../assets/icons/user.png";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); // Moved here

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 rounded col-12 col-sm-10">
      <Link to="/" className="navbar-brand">📝 My Notes</Link>
      {user?.isAdmin && (
        <span className="nav-item">
          <Link to="/admin/dashboard" className="nav-link">Admin</Link>
        </span>
      )}
      {user && (
        <div className="ms-auto">
          <span>
            <img
              src={userIcon}
              alt="User"
              onClick={() => setShowProfile(true)}
              style={{ cursor: "pointer", height: "30px" }}
            />
          </span>
        </div>
      )}

      <UserProfileModal show={showProfile} handleClose={() => setShowProfile(false)} />
    </nav>
  );
};

export default Navbar;
