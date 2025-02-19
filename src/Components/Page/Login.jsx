import React, { useState } from "react";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useUser } from "../../helper/useContext";
import { FaEyeSlash, FaEye } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_BACKEND_URL;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
    const { login } = useUser();
    const [loginInfo, setLoginInfo] = useState({
      email: "",
      password: "",
    })
    
    const navigate = useNavigate()

    const handleChange = (e) => {
      const { name, value } = e.target;
      const copyLoginInfo = {...loginInfo};
      copyLoginInfo[name] = value;
      setLoginInfo(copyLoginInfo);
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      const { email, password } = loginInfo;
      if(!email || !password) return toast.error("Email and password is required")
      try {
          const response = await axios.post( `${baseUrl}/auth/login`, loginInfo, {
            validateStatus: (status) => status < 500,
          });
          const result = response.data;
          const { success, message, user, token, error } = result;
          if(success && token){
            toast.success(message);
            login({ id:user.id, email: user.email, name: user.name, role: user.role }, token);
          //   Cookies.set("userToken", token, {
          //     secure: true, // Ensure the cookie is only sent over HTTPS
          //     sameSite: "Strict", // Prevent CSRF attacks
          //     expires: 1, // Expires in 1 day 
          // });
            setTimeout(()=>{
              navigate('/dashboard')
            , 1000})
          } else if(error){
            const details = error?.details[0].message;
            toast.error(details);
          } else if(!success){
            toast.error(message);
          }
      } catch (error) {
        console.error("Unexpected error during login:", error);
        toast.error("Something went wrong. Please try again.");
      }
  };
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-70px)] bg-gray-100 px-10">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">
          Login to <span className="text-blue-500">GoQuizzy</span>
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={loginInfo.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link to="/forgotPassword" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-lg text-white py-2 rounded-md font-medium transition hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login