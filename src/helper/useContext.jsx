import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get("userToken");
    const storedUser = Cookies.get("user");
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData, token) => {
    Cookies.set("userToken", token, { secure: true, sameSite: "Strict", expires: 1 });
    Cookies.set("user", JSON.stringify(userData), { secure: true, sameSite: "Strict", expires: 1 });
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("userToken");
    Cookies.remove("user");
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
