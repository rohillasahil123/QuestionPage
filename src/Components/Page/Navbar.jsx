import React, { useState, useEffect , useContext} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Cookies from "js-cookie";
import { useUser } from "../../helper/useContext";

const Navbar = () => {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();


  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    Cookies.remove("userToken");
    Cookies.remove("userRole");
    if (!Cookies.get("usertoken")) {
      navigate("/login");
    }
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

  const userRoles = Cookies.get('userRole');



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
            className={`menu-toggle fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"
              }`}
          ></i>
        </div>
      )}

      {/* Navigation Menu */}
      <ul
        className={`nav-menu p-2 gap-1 ${isMobileView ? (isMenuOpen ? "show" : "hidden") : ""
          }`}
      >
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item text-green-500 font-bold" : "nav-menu-item"
            }
            to="/"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item  text-green-500 font-bold" : "nav-menu-item"
            }
            to="/about"
          >
            About
          </NavLink>
        </li>
        <li>
        {userRoles === 'teacher' || userRoles === 'admin' &&(
        <NavLink to="/QuizzyGame" className="nav-menu-item">Questions</NavLink>
      )}
        </li>
        <li>
          <NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item text-green-500 font-bold" : "nav-menu-item"
            }
            to="/contact"
          >
            Contact Us
          </NavLink>
        </li>
        <li>
          {(Cookies.get("userToken"))? (<NavLink
            className={({ isActive }) =>
              isActive ? "nav-menu-item text-green-500 font-bold " : "nav-menu-item"
            }
            to="/dashboard"
          >
            Dashboard
          </NavLink>)
          :null}
        </li>
        <li>
          {Cookies.get("userToken") ? (
            <>
              <button
                type="button"
                onClick={handleLogout}
                className="font-bold  text-xl border w-[100px] bg-yellow-400 h-7 rounded-lg hover:bg-yellow-700 hover:cursor-pointer" style={{ zIndex: 100 }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLogin}
                type="button"
                className="font-bold  text-xl border w-[100px] bg-yellow-400 h-7 rounded-lg hover:bg-yellow-700 hover:cursor-pointer" style={{ zIndex: 100 }}
              >
                Login
              </button>
            </>
          )}

        </li>
      </ul>
    </div>
  );
};

export default Navbar;
