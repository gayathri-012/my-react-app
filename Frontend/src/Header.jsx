

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Header.css";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="nav-container">


      <div className="nav-left">
        <img src="/hrx-logo.png" alt="HRX Logo" className="logo" />
      </div>


      <ul className="nav-menu">
        <li><NavLink to="/" end className="nav-item">Home</NavLink></li>
        <li><NavLink to="/Collection" className="nav-item">Collection</NavLink></li>
        <li><NavLink to="/category" className="nav-item">HRX Hub</NavLink></li>
        <li><NavLink to="/Community" className="nav-item">Community</NavLink></li>
        <li><NavLink to="/productview" className="nav-item">Shop Now</NavLink></li>
        <li><NavLink to="/connect" className="nav-item">Connect</NavLink></li>
      </ul>


      <div>
        <span onClick={() => navigate("/cart")}>🛒</span>
      </div>


      <div className="nav-right">
        {user ? (
          <div className="user-info">

            <span
              className="avatar-icon"
              onClick={() => setShowMenu(!showMenu)}
            >
              👤
            </span>

            <span className="username">Hi, {user.firstname}</span>

            {showMenu && (
              <div className="dropdown">

               
                {user.role !== "admin" && (
                  <p
                    onClick={() => {
                      navigate("/orders");
                      setShowMenu(false);
                    }}
                  >
                    My Orders
                  </p>
                )}

                
                {user.role === "admin" && (
                  <p
                    onClick={() => {
                      navigate("/dashboard");
                      setShowMenu(false);
                    }}
                  >
                    Admin Dashboard
                  </p>
                )}

                <p onClick={handleLogout}>Logout</p>

              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            Login
          </button>
        )}
      </div>

    </nav>
  );
}

export default Header;
