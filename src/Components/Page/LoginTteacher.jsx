import React, { useState } from "react";
import axios from "axios"
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const LoginTteacher = () => {
     
      const [formData, setFormData] = useState({
        Gmail: "",
        password: "",
     
      })
      


      const navigate = useNavigate()
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };


      const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://goquizzy.com/login/teacher", formData);
            console.log(response.data.token)
               if (response.data.token) {
                      const { token } = response.data;
                      Cookies.set("userToken", token, {
                        secure: true, 
                        sameSite: "Strict",
                        expires: 1,
                      });
                    } else {
                      toast.error("form subbmitted failed");
                    }
                if(response.data.message === "success" ){
                  navigate("/")
                }else{
                      toast.error("email or password Wrong")
                }
                
        }catch(error){
            console.log(error)
        }   
      }

     



  return (
    <>
     <div className="h-[100vh]">
    <div className="max-w-md h-[70vh] mx-auto sm:w-[60%] mt-[10%] p-4 border rounded shadow">
    <h2 className="text-2xl font-bold mb-4 text-center">Login Teacher</h2>
    <form onSubmit={handleSubmit}>
        <div className="w-[90%]">
          <label
            htmlFor="teacherName"
            className="block text-sm text-black font-medium mb-2"
          >
            Email
          </label>
          <input
            type="gmail"
            id="Gmail"
            placeholder="Gmail"
            name="Gmail"
            value={formData.Gmail}
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
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <h4 className="mt-6 ml-[13%]">if you have not register ? <Link to='/schoolform'><span className="text-blue-600">register now</span></Link> </h4>
      
            <button
            type="submit"
            className="w-[90%] bg-blue-500 text-white mt-4 py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Login
          </button>
       

       

      </form>
      </div>
      </div>
      </>
  )
}

export default LoginTteacher