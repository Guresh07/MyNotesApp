import React, { useState } from "react";
import UserProfileModal from "./UserProfileModal";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [showProfile, setShowProfile] = useState(false);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 rounded col-12 col-sm-10">
            <Link to="/" className="navbar-brand">📝 My Notes</Link>
            <div className="ms-auto">
                <span className="">
                    <img src="src/assets/icons/user.png" alt="" onClick={() => setShowProfile(true)} />
                </span>
            </div>

            <UserProfileModal show={showProfile} handleClose={() => setShowProfile(false)} />
        </nav>
    );
};

export default Navbar;
