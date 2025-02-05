import React, { useState } from "react";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useUser } from "../../helper/useContext";

const Login = () => {
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
          const response = await axios.post( "http://3.108.59.193/auth/login", loginInfo, {
            validateStatus: (status) => status < 500,
        } );
          const result = response.data;
          const { success, message, user, token, error } = result;
          if(success && token){
            toast.success(message);
            login({ email: user.email, name: user.name, role: user.role }, token);
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
    <>
     <div className="sm:h-[100vh] h-[80vh] ">
    <div className="max-w-md h-[70vh] mx-auto sm:w-[60%] mt-[10%] p-4 border rounded shadow">
    <h2 className="text-2xl  mb-4 text-center  font-extralight">Login GoQuizzy</h2>
    <form>
        <div className="w-[90%]">
          <label
            htmlFor="teacherName"
            className="block text-sm text-black font-medium mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>

        <div className="w-[90%] mt-3">
          <label
            htmlFor="schoolName"
            className="block text-sm font-medium text-black mb-2"
          >
        Password
          </label>
          <input
            type="Password"
            id="password"
            placeholder="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <h4 className="mt-6 ml-[13%]">if you have not register ? <Link to='/schoolform'><span className="text-blue-600">register now</span></Link> </h4>
      
          <button
          type="submit"
          className="w-[90%] bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          onClick={handleLogin}
          >
            Login
          </button>
      </form>
      </div>
      </div>
      </>
  )
}

export default Login