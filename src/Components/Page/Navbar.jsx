import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from '../Assets/logo.png'

const Navbar = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 1000);
    if (window.innerWidth > 1000) {
      setIsMenuOpen(false); // Close the menu when resizing to desktop
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

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
            {/* <img src={logo} alt="" /> */}
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
            className="nav-menu-item"
            to="/"
            activeClassName="active-link"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-menu-item"
            to="/about"
            activeClassName="active-link"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            className="nav-menu-item"
            to="/contact"
            activeClassName="active-link"
          >
            Contact Us
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
