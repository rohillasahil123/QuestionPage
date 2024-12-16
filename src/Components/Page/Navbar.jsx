import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";

const Navbar = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const checkLoginStatus = () => {
      const token = Cookies.get("userToken");
      setIsLoggedIn(!!token); 
    };

    checkLoginStatus(); 
  }, []);

  const handleLogin = () => {
    const email = "test@example.com";
    const password = "123456";

    if (email && password) {
      Cookies.set("userToken", "sampleToken");
      setIsLoggedIn(true);
      navigate("/");
      toast.success("Logged in successfully");
    } else {
      toast.error("Email and password are required");
    }
  };


  const handleLogout = () => {
    Cookies.remove("userToken");
    setIsLoggedIn(false); 
    navigate("/loginteacher");
    toast.success("Logged out successfully");
  };


  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 1000);
    if (window.innerWidth > 1000) {
      setIsMenuOpen(false); 
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  }

 

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


 
  return (
    <div className="navbar">
      {/* Logo */}
      <div className="nav-logo">
        <NavLink to="/">
          <div className="nav-logo-box">
            <div className="logo"></div>
            <h1>Go Quizzy</h1>
          </div>
        </NavLink>
      </div>

      {/* Hamburger Icon */}
      {isMobileView && (
        <div className="nav-menu-mobile" onClick={toggleMenu}>
          <i
            className={`menu-toggle fa-solid ${
              isMenuOpen ? "fa-xmark" : "fa-bars"
            }`}
          ></i>
        </div>
      )}

      {/* Navigation Menu */}
      <ul
        className={`nav-menu ${
          isMobileView ? (isMenuOpen ? "show" : "hidden") : ""
        }`}
      >
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item active-link" : "nav-menu-item"
            }
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item active-link" : "nav-menu-item"
            }
            to="/about"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item active-link" : "nav-menu-item"
            }
            to="/QuizzyGame"
          >
            Question
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item active-link" : "nav-menu-item"
            }
            to="/contact"
          >
            Contact Us
          </NavLink>
        </li>
        <li>
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
