import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUser } from "./useContext";

function RefreshHandler() {
  const { login, isLoggedIn } = useUser();  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const userToken = Cookies.get("userToken");
      const userCookie = Cookies.get("user");

      if (userToken && userCookie) {
        try {
          const userData = JSON.parse(userCookie);
          login(userData, userToken);

          if (location.pathname === "/login") {
            navigate("/dashboard", { replace: false });
          }
        } catch (error) {
          console.error("Error parsing userData cookie:", error);
        }
      }
    }
  }, [location, isLoggedIn, login, navigate]);

  return null;
}

export default RefreshHandler;
