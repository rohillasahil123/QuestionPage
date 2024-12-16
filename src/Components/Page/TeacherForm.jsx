import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

import { useNavigate  , Link} from "react-router-dom";

const TeacherForm = () => {
  const [formData, setFormData] = useState({
    schoolName: "",
    teacherName: "",
    Address: "",
    Number: "",
    Gmail: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      const response = await axios.post("https://goquizzy.com/teacherform", formData);
      console.log(response.data)
      if (response.data.message === "successfull") {
        toast.success("Form Submitted Successfully!");
        navigate("/loginteacher");  
      } else {
        toast.error("form subbmitted failed");
      }
     
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  };






  return (
    <div className="h-[100vh]">
    <div className="max-w-md h-[90vh]  mx-auto sm:w-[60%] mt-[24%] sm:mt-[9%] p-4 border rounded shadow  ">
      <h2 className="text-2xl font-bold mb-4 text-center">School Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Row 1 */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="teacherName"
              className="block text-sm text-black font-medium mb-2"
            >
              Teacher Name
            </label>
            <input
              type="text"
              id="teacherName"
              name="teacherName"
              placeholder="Teacher Name"
              value={formData.teacherName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium text-black mb-2"
            >
              School Name
            </label>
            <input
              type="text"
              id="schoolName"
              placeholder="School Name"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="Address"
              className="block text-sm text-black font-medium mb-2"
            >
              Address
            </label>
            <input
              type="text"
              id="Address"
              placeholder="address" 
              name="Address"
              value={formData.Address}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="Number"
              className="block text-sm text-black font-medium mb-2"
            >
              Number
            </label>
            <input
              type="tel"
              id="Number"
              name="Number"
               placeholder="phone number"
              value={formData.Number}
              maxLength={10}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label
              htmlFor="Gmail"
              className="block text-sm text-black font-medium mb-2"
            >
              Gmail
            </label>
            <input
              type="email"
              id="Gmail"
               placeholder="gmail"
              name="Gmail"
              value={formData.Gmail}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>

          <div className="w-1/2">
            <label
              htmlFor="password"
              className="block text-sm text-black font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
               placeholder="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
        </div>

        {/* Row 4 */}
        <div className="mb-4">
          <label
            htmlFor="confirmPassword"
            className="block text-sm text-black font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full  bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Submit
        </button>

      </form>
      <h4 className="mt-3">Already Registered? <Link to='/loginteacher'><span className="text-blue-600">Login here</span></Link> </h4>
    </div>
    </div>
  );
};

export default TeacherForm;
